import {
    CONTAINER_NO_SUPPORTED
} from './Constants.js';

import {
    isRenderObject
} from './Utils.js';

import {
    mount
} from './MountElement.js';

/**
 * Crea un objeto root para gestionar la renderización en un contenedor del DOM.
 * @param {HTMLElement} container El nodo del DOM donde se montará la aplicación.
 * @returns {{render: function, unmount: function}} Un objeto con métodos para gestionar el root.
 */
function createRoot(container) {
    // 1. Validamos que el contenedor sea un Nodo que pueda albergar hijos.
    if (
        container.nodeType !== Node.ELEMENT_NODE &&
        container.nodeType !== Node.DOCUMENT_NODE &&
        container.nodeType !== Node.DOCUMENT_FRAGMENT_NODE
    ) {
        throw new TypeError(CONTAINER_NO_SUPPORTED);
    }

    if (container === document) {
        container = document.documentElement;
    }

    /** @type {Function|{ render: Function, unmount: Function, type: string|Function, key: string|null, ref: { current }, props: Object<string, any> }|string|number|null|undefined} */
    var currentElement = null;

    return {
        /**
         * Renderiza un elemento en el contenedor del root.
         * @param {Function|currentElement|string|number|null|undefined} element El elemento a renderizar.
         */
        render(element) {

            // Montar
            mount(element, container, domNode => {
                container.appendChild(domNode);
            });
            currentElement = element;
        },

        /**
         * Desmonta el árbol de componentes del root y limpia los recursos.
         */
        unmount() {
            if (isRenderObject(currentElement)) {
                currentElement.unmount();
            }
            container.innerHTML = '';
        }
    };
}


export {
    createRoot
};
