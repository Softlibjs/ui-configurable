import {
    diffing
} from './DiffElement.js';

import {
    unmountElement
} from './UnmountElement.js';

/**
 * @param {Object<string, any>} target - Componente padre que recive las notificaciones de estado, de lo contrario string, number, boolean, null o undefined
 * @param {Object<string, any>} currentElement El elemento renderizado.
 * @param {HTMLElement} parentDOM - El elemento HTML donde se renderizo el componente
 * @param {Node} node - El nodo HTML que representa el componente dentro del DOM.
 * @param {Map<string, { child, node }>} cacheKeys - Un arreglo con los nodos DOM.
 * @returns {Function}
 */
function lifecycleElement(currentElement, componentRender, parentDOM, node, cacheKeys) {

    return {
        diffing: diffing(currentElement, componentRender, parentDOM, node, cacheKeys),
        unmount: unmountElement(currentElement, componentRender, parentDOM, node, cacheKeys)
    }
};

export {
    lifecycleElement
};
