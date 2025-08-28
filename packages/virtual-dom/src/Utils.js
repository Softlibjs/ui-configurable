function equalRenderNode(obj1, obj2) {
    if (isRenderNode(obj1) && isRenderNode(obj2)) {
        return obj1.type === obj2.type
    }
    return false;
}

function equalRenderFunction(obj1, obj2) {
    if (isRenderFunction(obj1) && isRenderFunction(obj2)) {
        return obj1.type === obj2.type
    }
    return false;
}

function isRenderFunction(element) {
    if (isRenderObject(element)) {
        return typeof element.type === 'function';
    }
    return false;
}

function isRenderNode(element) {
    if (isRenderObject(element)) {
        return typeof element.type === 'string';
    }
    return false;
}

function isRenderFragment(element) {
    if (isRenderNode(element)) {
        return element.type.toLowerCase() === 'fragment';
    }
    return false;
}

function isRenderObject(element) {
    return isValidObject(element) && element.type;
}

function isRenderNothig(element) {
    return element === null || element === undefined || typeof element === 'boolean';
}

function isRenderText(element) {
    return typeof element === 'string' || typeof element === 'number';
}

function isValidObject(obj) {
    return obj !== null && typeof obj === 'object' && Object.keys(obj).length > 0;
}

/**
 * Para el fallback conviene estandarizar el formato, lleva el prefijo $$,
 * así siempre es consistente y no se confunde con una key de usuario.
 * @param {number} index 
 * @returns {string}
 */
function createMountKey(index) {
    return `$$index:${index}`;
}

function hasMountKey(element) {
    if (isValidObject(element)) {
        var key = element.key;
        if (typeof key === 'number') {
            key = key.toString()
        }
        return isRenderObject(element) && typeof key === 'string' && key.trim().length > 0;
    }
    return false;
}

export {
    equalRenderFunction,
    equalRenderNode,
    isRenderFunction,
    isRenderNode,
    isRenderFragment,
    isRenderObject,
    isRenderNothig,
    isRenderText,
    isValidObject,
    createMountKey,
    hasMountKey
};
