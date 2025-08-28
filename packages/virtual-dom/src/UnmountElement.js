import {
    isRenderNothig,
    isRenderText,
    isRenderFunction,
} from './Utils.js';

/**
 * @param {Object<string, any>} target - Componente padre que recive las notificaciones de estado, de lo contrario string, number, boolean, null o undefined
 * @param {Object<string, any>} currentElement El elemento renderizado.
 * @param {HTMLElement} parentDOM - El elemento HTML donde se renderizo el componente
 * @param {Node} node - El nodo HTML que representa el componente dentro del DOM.
 * @param {Map<string, { child, node }>} cacheKeys - Un arreglo con los nodos DOM.
 * @returns {Function}
 */
function unmountElement(currentElement, componentRender, parentDOM, node, cacheKeys) {

    return function unmount() {
        if (isRenderNothig(componentRender) || isRenderText(componentRender)) {
            parentDOM.removeChild(node);
            return;
        }

        if (isRenderFunction(componentRender)) {
            componentRender.unmount();
            return;
        }

        var props = componentRender.props;

        for (const key in Object.keys(props)) {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                const eventName = key.slice(2).toLowerCase();
                node.removeEventListener(eventName, props[key]);
            }
        }

        cacheKeys.forEach(childValue => {
            var { lifecycle } = childValue;
            lifecycle.unmount();
        });
    }
}


export {
    unmountElement
};
