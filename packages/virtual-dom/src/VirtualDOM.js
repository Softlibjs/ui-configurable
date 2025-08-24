import {
    setComponentContext,
    clearComponentContext
} from './Hooks.js';

/**
 * Crea un elemento del DOM a partir de un objeto que representa el elemento.
 * @param {Object<string, any>} element El objeto que representa el elemento.
 * @returns {Node} El nodo del DOM creado.
 */
function createElement(element) {
    // Si el elemento es un string o un número, creamos un nodo de texto.
    if (typeof element === 'string' || typeof element === 'number') {
        return document.createTextNode(element.toString());
    }

    // Si el elemento es un objeto que representa un componente
    if (typeof element === 'object' && element !== null) {
        const elementType = element.type;
        const elementProps = element.props;

        // Si el tipo de elemento es una funcion, es un componente funcional
        if (typeof elementType === 'function') {

            const observer = {};
            observer.onUpdate = () => {
                const parentDOM = observer.prevNode.parentNode;
                setComponentContext(observer);
                const componentResult = elementType(elementProps);
                clearComponentContext(null);
                const nextNode = createElement(componentResult, parentDOM);
                parentDOM.replaceChild(nextNode, observer.prevNode);
                observer.prevNode = nextNode;
            };

            setComponentContext(observer);
            const componentResult = elementType(elementProps);
            clearComponentContext(null);

            const prevNode = createElement(componentResult);
            observer.prevNode = prevNode;
            return prevNode;
        }

        // Si el tipo del elemento es un estring, es un elemento HTML standard
        if (typeof elementType === 'string') {
            const domElement = document.createElement(elementType);

            // Iteramos sobre las propiedades (props) para aplicarlas al elemento del DOM
            for (const propName in elementProps) {
                const propValue = elementProps[propName];

                if (propName === 'children') {
                    // Manejamos los hijos del elemento de forma recursiva.
                    // Los hijos pueden ser un solo elemento o un array de elementos.
                    const children = Array.isArray(propValue) ? propValue : [propValue];

                    children.forEach(child => {
                        domElement.appendChild(createElement(child));
                    });
                } else if (propName.startsWith('on') && typeof propValue === 'function') {
                    // Manejamos eventos: onClick, onChange, etc.
                    const eventName = propName.toLowerCase().substring(2);
                    domElement.addEventListener(eventName, propValue);
                } else if (propName === 'className') {
                    // Manejo de la propiedad especial 'className'
                    domElement.setAttribute('class', propValue);
                } else if (propName === 'style' && typeof propValue === 'object' && propValue !== null) {
                    // Manejo del objeto 'style'
                    for (const styleProp in propValue) {
                        domElement.style[styleProp] = propValue[styleProp];
                    }
                } else {
                    // Para otras propiedades, las establecemos como atributos.
                    domElement[propName] = propValue;
                }
            }

            return domElement;
        }
    }

    // En caso de que el elemento no sea de un tipo válido.
    return document.createComment("Elemento no válido");
}


/**
 * Renderiza un elemento de nuestra biblioteca en un contenedor del DOM.
 * @param element El elemento a renderizar. Podría ser un objeto, string, o función.
 * @param {HTMLElement} container El nodo del DOM (por ejemplo, un <div>) donde se renderizará el elemento.
 */
function render(element, container) {
    if (!container) {
        throw new Error('El contenedor del DOM no fue encontrado.');
    }

    // Limpiamos el contenido anterior para renderizar el nuevo.
    container.innerHTML = '';

    const domElement = createElement(element);
    container.appendChild(domElement);
}

export { render };
