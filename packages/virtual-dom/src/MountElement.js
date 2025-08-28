import {
    TYPE_RENDER_NOTHING,
    TYPE_RENDER_NO_SUPPORTED
} from './Constants.js';

import {
    isRenderFunction,
    isRenderNode,
    isRenderNothig,
    isRenderText,
    createMountKey,
    hasMountKey
} from './Utils.js';

import {
    setComponentContext,
    clearComponentContext
} from './Hooks.js';

import {
    lifecycleElement
} from './LifecycleElement.js';


/**
 * 
 * @param {Function|{ render: Function, unmount: Function, type: string|Function, key: string|null, ref: { current }, props: Object<string, any> }|string|number|null|undefined} element El elemento a renderizar.
 * @param {Node} container 
 * @param {(domNode: HTMLElement) => void} callback 
 * @returns {void}
 */
function mount(element, container, callback) {
    // Caso A: Boolean, null o undefined → no renderizar nada
    if (isRenderNothig(element)) {
        const domNode = document.createComment(TYPE_RENDER_NOTHING);
        callback(domNode);
        return lifecycleElement(null, element, container, domNode, new Map());
    }
    // Caso B: String o Number → TextNode
    if (isRenderText(element)) {
        const domNode = document.createTextNode(element);
        callback(domNode);
        return lifecycleElement(null, element, container, domNode, new Map());
    }
    // Caso C: Componente funcional → creación profunda
    if (isRenderFunction(element)) {
        const func = element.type;
        const props = element.props;

        setComponentContext(element);
        const componentResult = func(props);
        clearComponentContext(null);

        var componentLifecycle = mount(componentResult, container, callback);
        element.subscriber(componentLifecycle);
        return componentLifecycle;
    }
    // Caso D: Si es un elemento nativo del DOM
    if (isRenderNode(element)) {
        const _tagName = element.type;
        let domNode = document.createDocumentFragment();
        if (_tagName.toLowerCase() !== 'fragment') {
            domNode = document.createElement(_tagName);
            // Aplicamos atributos, estilos y eventos
            mountProps(domNode, element.props);
        }

        // Montamos los hijos
        let cacheKeys = mountChildren(domNode, element.props.children);
        callback(domNode);
        var tagLifecycle = lifecycleElement(null, element, container, domNode, cacheKeys);
        element.subscriber(tagLifecycle);
        return tagLifecycle;
    }
    // Caso E: Tipo no soportado → mensaje de error
    console.error(TYPE_RENDER_NO_SUPPORTED);
    const domNode = document.createComment(TYPE_RENDER_NO_SUPPORTED);
    callback(domNode);
    return lifecycleElement(null, element, container, domNode, new Map());
}

/**
 * Aplica los estilos iniciales.
 * @param {node} element
 * @param {object} styles
 */
function mountProps(element, props) {
    for (const key in props) {
        const value = props[key];
        if (key === 'children') continue;
        if (key.startsWith('on') && typeof value === 'function') {
            const eventName = key.slice(2).toLowerCase();
            element.addEventListener(eventName, value);
        } else if (key === 'style' && typeof value === 'object') {
            Object.assign(element.style, value);
        } else {
            element.setAttribute(key, value);
        }
    }
}

/**
 * 
 * @param {*} element 
 * @param {*} children 
 * @returns 
 */
function mountChildren(element, children) {
    var mountKeys = new Map();

    children.forEach(function (child, index) {
        var childKey = createMountKey(index);
        var node = null;

        if (hasMountKey(child)) {
            childKey = child.key;
        }

        var lifecycle = mount(child, element, domNode => {
            node = domNode;
            element.appendChild(domNode)
        });

        mountKeys.set(childKey, { child, node, lifecycle });
    });

    return mountKeys;
}

export {
    mount
};
