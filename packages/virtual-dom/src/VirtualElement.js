import {
    TYPE_NO_SUPPORTED
} from './Constants.js';

import {
    setComponentContext,
    clearComponentContext,
    runCleanupEffects
} from './Hooks.js';

/**
 * Crea un elemento del DOM a partir de un objeto que representa el elemento.
 * @param {string|Function} type Tipo de elemento a crear.
 * @param {Object<string, any>} [props] Propiedades del elemento.
 * @param {Object<string, any>|string|number|null|undefined} [children] Nodos del elemento.
 * @returns {{ render: Function, unmount: Function, type: string|Function, key: string|null, ref: { current }, props: Object<string, any> }} Un objeto con métodos para gestionar el elemento.
 */
function createElement(type, props, children) {
    if (
        !(typeof type === 'string' || typeof type === 'function')
    ) {
        throw new TypeError(TYPE_NO_SUPPORTED);
    }

    var _key = null;
    var _ref = null;
    var _props = {};
    var _children = [];
    /** @type {{ unmount: () => null, diffing: (componentResult) => null }} */
    var lifecycleElement = null;

    // Las propiedades restantes se añaden a un nuevo objeto props.
    for (let propName in props) {
        // Omitir los nombres de props reservados.
        if (propName === 'key') {
            _key = props[propName];
            continue;
        }
        if (propName === 'ref') {
            _ref = props[propName];
            continue;
        }
        if (propName === 'children') {
            _children = props[propName];
            continue;
        }
        _props[propName] = props[propName];
    }

    // Los 'children' pueden ser mas de un argumento, and those are transferred onto
    // the newly allocated props object.
    const childrenLength = arguments.length - 2;
    if (childrenLength === 1) {
        _children = Array.isArray(children) ? children : [children];
    } else if (childrenLength > 1) {
        const childArray = Array(childrenLength);
        for (let i = 0; i < childrenLength; i++) {
            childArray[i] = arguments[i + 2];
        }
        _children = childArray;
    }

    return {
        type: type,
        key: _key,
        ref: _ref,
        props: {
            ..._props,
            children: _children.slice()
        },

        /**
         * 
         * @param {(element: Object<string, any>) => void} funDiffing 
         */
        subscriber(lifecycle) {
            lifecycleElement = lifecycle;
        },

        /**
         * Renderiza un elemento en el contenedor del root.
         * @param {Object<string, any>|string|number|null} nextState El elemento a renderizar.
         */
        onUpdate() {
            const nextProps = { ..._props, children: _children.slice() };

            // Establecer el contexto del hook antes de llamar a la función
            setComponentContext(this);
            // Llama a la función con las props
            const newResult = type(nextProps);
            // Limpiar el contexto del hook después de la llamada
            clearComponentContext();

            lifecycleElement = lifecycleElement.diffing(newResult);
        },

        reconcileWith(newResult) {
            lifecycleElement = lifecycleElement.diffing(newResult);
        },

        /**
         * Desmonta el árbol de componentes del root y limpia los recursos.
         */
        unmount() {
            lifecycleElement.unmount();
            runCleanupEffects(this);
        }
    };
}


export {
    createElement
};
