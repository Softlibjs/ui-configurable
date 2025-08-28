import {
    equalRenderNode,
    equalRenderFunction,
    isRenderNothig,
    isRenderText,
    isRenderObject,
    createMountKey,
    hasMountKey
} from './Utils.js';

import {
    mount
} from './MountElement.js';

import {
    lifecycleElement
} from './LifecycleElement.js';

import {
    setComponentContext,
    clearComponentContext
} from './Hooks.js';

/**
 * @param {Object<string, any>} target - Componente padre que recive las notificaciones de estado, de lo contrario string, number, boolean, null o undefined
 * @param {Object<string, any>} currentElement El elemento renderizado.
 * @param {HTMLElement} parentDOM - El elemento HTML donde se renderizo el componente
 * @param {Node} node - El nodo HTML que representa el componente dentro del DOM.
 * @param {Map<string, { child, node }>} cacheKeys - Un arreglo con los nodos DOM.
 * @returns {Function}
 */
function diffing(currentElement, componentRender, parentDOM, node, cacheKeys) {

    return function reconcile(newComponentRender) {
        // Caso especial: null, undefined, boolean → no renderizar nada
        if (isRenderNothig(componentRender) && isRenderText(newComponentRender)) {
            return lifecycleElement(currentElement, newComponentRender, parentDOM, node, cacheKeys);
        }

        // Texto plano: string o number
        if (isRenderText(componentRender) && isRenderText(newComponentRender)) {
            if (componentRender !== newComponentRender) {
                node.textContent = newComponentRender;
            }
            return lifecycleElement(currentElement, newComponentRender, parentDOM, node, cacheKeys);
        }

        // Componente funcional → reconciliación profunda
        if (equalRenderFunction(componentRender, newComponentRender)) {
            var func = componentRender.type;
            var nextProps = newComponentRender.props;

            // Establecer el contexto del hook antes de llamar a la función
            setComponentContext(componentRender);
            // Llama a la función con las props
            var newRender = func(nextProps);
            // Limpiar el contexto del hook después de la llamada
            clearComponentContext();

            componentRender.reconcileWith(newRender);

            return lifecycleElement(currentElement, newComponentRender, parentDOM, node, cacheKeys);
        }

        if (equalRenderNode(componentRender, newComponentRender)) {
            var newChildren = newComponentRender.props.children;

            if (componentRender.type.toLowerCase() !== 'fragment') {
                updateProps(node, componentRender.props, newComponentRender.props);
            }

            var _cacheKeys = reconcileChildren(node, newChildren, cacheKeys);

            return lifecycleElement(currentElement, newComponentRender, parentDOM, node, _cacheKeys);
        }

        // Elementos de diferentes tipos → reconstrucción completa
        if (typeof componentRender !== typeof newComponentRender) {

            return;
        }
    }
}

function updateProps(element, oldProps, newProps) {
    // 1. Remover atributos antiguos que ya no existen en los nuevos
    for (const key in oldProps) {
        if (key === 'children') continue;
        if (!(key in newProps)) {
            if (key.startsWith('on') && typeof oldProps[key] === 'function') {
                const eventName = key.slice(2).toLowerCase();
                element.removeEventListener(eventName, oldProps[key]);
            } else {
                element.removeAttribute(key);
            }
        }
    }

    // 2. Añadir o actualizar los atributos nuevos
    for (const key in newProps) {
        const oldValue = oldProps[key];
        const newValue = newProps[key];
        if (key === 'children') continue;
        if (newValue !== oldValue) {
            // Eventos → actualizar listener
            if (key.startsWith('on') && typeof newValue === 'function') {
                const eventName = key.slice(2).toLowerCase();
                if (oldValue && typeof oldValue === 'function') {
                    element.removeEventListener(eventName, oldValue);
                }
                element.addEventListener(eventName, newValue);
            }
            // Estilos → diff entre objetos de estilo
            else if (key === 'style' && typeof newValue === 'object') {
                updateStyles(element.style, newValue, oldValue);
            }
            // Atributos genéricos
            else {
                element.setAttribute(key, newValue);
            }
        }
    }
}

function updateStyles(style, newStyles, oldStyles) {
    // 1. Eliminar propiedades antiguas que ya no existen en los nuevos estilos
    for (const key in oldStyles) {
        if (!(key in newStyles)) {
            style[key] = "";
        }
    }

    // 2. Añadir o actualizar propiedades nuevas
    for (const key in newStyles) {
        const oldValue = oldStyles ? oldStyles[key] : undefined;
        const newValue = newStyles[key];

        if (newValue !== oldValue) {
            style[key] = newValue;
        }
    }
}

function reconcileChildren(element, newChildren, oldKeyeds = new Map()) {
    const reconciledKeyes = new Map();
    const oldValueKey = Array.from(oldKeyeds.values());
    const maxLen = Math.max(oldValueKey.length, newChildren.length);

    for (let i = 0; i < maxLen; i++) {
        const newChild = newChildren.at(i);
        let childKey = createMountKey(i);
        //let refNode = element.childNodes.item(i);

        if (hasMountKey(newChild)) {
            childKey = newChild.key;
        }

        var {
            child: oldChild,
            node: oldNode,
            lifecycle
        } = oldKeyeds.get(childKey) ?? {};

        // la nueva renderizacion tiene menos hijos
        if (newChildren.length <= i) {
            lifecycle.unmount();
            continue;
        }

        if (
            (isRenderNothig(oldChild) && isRenderText(newChild)) ||
            (isRenderText(oldChild) && isRenderText(newChild)) ||
            (equalRenderFunction(oldChild, newChild)) ||
            (equalRenderNode(oldChild, newChild))
        ) {
            if (equalRenderFunction(oldChild, newChild)) {
                var func = oldChild.type;
                var nextProps = newChild.props;

                // Establecer el contexto del hook antes de llamar a la función
                setComponentContext(oldChild);
                // Llama a la función con las props
                var newRender = func(nextProps);
                // Limpiar el contexto del hook después de la llamada
                clearComponentContext();

                lifecycle = lifecycle.diffing(newRender);
            } else {
                lifecycle = lifecycle.diffing(newChild);
            }
            reconciledKeyes.set(childKey, { child: oldChild, node: oldNode, lifecycle });
        } else {
            if (isRenderObject(oldChild)) oldChild.unmount();
            lifecycle = mount(newChild, element, domNode => {
                if (oldNode) element.replaceChild(domNode, oldNode);
                else element.appendChild(domNode);
                oldNode = domNode;
            });
            reconciledKeyes.set(childKey, { child: newChild, node: oldNode, lifecycle });
        }
    }

    return reconciledKeyes;
}

export {
    diffing
};
