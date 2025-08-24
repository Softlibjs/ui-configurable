var componentStateMap = new WeakMap();

var currentComponent = null;

var hookIndex = 0;

/**
 * Establece el componente actual para el contexto de los hooks.
 * @param {VirtualElement} component La instancia del componente que se va a renderizar.
 */
function setComponentContext(component) {
    // Definir el contexto
    currentComponent = component;
    // Resetear la posicion de los hooks, para preservar el orden de ejecucion
    hookIndex = 0;
    if (!componentStateMap.has(currentComponent)) {
        componentStateMap.set(currentComponent, {
            state: [],
            effects: []
        });
    }
}

/**
 * Limpia el contexto del componente actual.
 */
function clearComponentContext() {
    currentComponent = null;
}

/**
 * Un hook para gestionar el estado en componentes funcionales.
 * @param {any} initialState El valor inicial del estado.
 * @returns {[any, function(any): void]} Una tupla con el valor del estado actual y una función para actualizarlo.
 */
function useState(initialState) {
    if (!currentComponent) {
        throw new Error('useState must be called inside a functional component.');
    }
    //Capturar el contexto
    var component = currentComponent;
    var stateData = componentStateMap.get(component).state;
    var myHookIndex = hookIndex++;
    // Si el estado no existe, inicializarlo
    if (stateData[myHookIndex] === undefined) {
        stateData[myHookIndex] = initialState;
    }
    // La función para actualizar el estado
    function setState(newState) {
        if (stateData[myHookIndex] !== newState) {
            stateData[myHookIndex] = newState;
            // Estado actualizado, se requiere re-render
            // El componente actual se obtiene del closure.
            component.onUpdate(newState);
        }
    }
    return [
        stateData[myHookIndex],
        setState
    ];
}

/**
 * Un hook para gestionar efectos secundarios.
 * @param {function(): void} effect La función de efecto.
 * @param {Array<any>} dependencies Un array de dependencias.
 */
function useEffect(effect, dependencies) {
    if (!currentComponent) {
        throw new Error('useEffect must be called inside a functional component.');
    }
    //Capturar el contexto
    var component = currentComponent;
    var effectsData = componentStateMap.get(component).effects;
    var myHookIndex = hookIndex++;
    // Si no hay dependencias, ejecutar siempre
    var hasNoDependencies = !dependencies || dependencies.length === 0;
    // Si no hay efecto anterior, jecutar
    if (effectsData[myHookIndex] === undefined) {
        effectsData[myHookIndex] = {
            dependencies: dependencies,
            cleanup: null
        };
        effectsData[myHookIndex].cleanup = effect();
    }
    // Si hay dependencias, comparar con las anteriores
    else {
        var prevDependencies = effectsData[myHookIndex].dependencies;
        var dependenciesChanged = dependencies.some(function (dep, i) {
            return dep !== prevDependencies[i];
        });
        if (hasNoDependencies || dependenciesChanged) {
            // Si el efecto anterior tenia una cleanup, llamarla
            if (effectsData[myHookIndex].cleanup) {
                effectsData[myHookIndex].cleanup();
            }
            effectsData[myHookIndex].cleanup = effect();
        }
        effectsData[myHookIndex].dependencies = dependencies;
    }
}

/**
 * Ejecuta todas las funciones de limpieza de los efectos para un componente.
 * @param {VirtualElement} component La instancia del componente a limpiar.
 */
function runCleanupEffects(component) {
    if (componentStateMap.has(component)) {
        var effectsData = componentStateMap.get(component).effects;
        effectsData.forEach(function (effect) {
            if (effect.cleanup && typeof effect.cleanup === 'function') {
                effect.cleanup();
            }
        });
        // Limpiar el estado del componente del mapa para evitar fugas de memoria
        componentStateMap.delete(component);
    }
}

export {
    useState,
    useEffect,
    setComponentContext,
    clearComponentContext,
    runCleanupEffects
};
