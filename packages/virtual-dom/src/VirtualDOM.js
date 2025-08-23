/**
 * Renderiza un elemento de nuestra biblioteca en un contenedor del DOM.
 * @param element El elemento a renderizar. Podría ser un objeto, string, o función.
 * @param {HTMLElement} container El nodo del DOM (por ejemplo, un <div>) donde se renderizará el elemento.
 */
function render(element, container) {
    if (!container) {
        throw new Error('El contenedor del DOM no fue encontrado.');
    }

    // Si el elemento es una cadena de texto, lo insertamos directamente.
    if (typeof element === 'string') {
        container.innerHTML = element;
        return;
    }

    // Por ahora, para simplificar y empezar, la función solo manejará strings.
    console.warn("Solo se pueden renderizar strings en este momento. La lógica para elementos complejos se agregará más adelante.");
}

export { render };
