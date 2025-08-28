const CONTAINER_NO_SUPPORTED = 'Es fundamental que el contenedor sea un elemento que pueda albergar otros elementos hijos. El contenedor (container) debe ser un nodo de tipo elemento (ELEMENT_NODE) o un nodo de tipo documento (DOCUMENT_NODE) o un fragmento de documento (DOCUMENT_FRAGMENT_NODE).';
const PROPS_NO_SUPPORTED = 'Pasa atributos y elementos secundarios a este componente como un solo objeto';
const TYPE_NO_SUPPORTED = 'El argumento de tipo puede ser una cadena de nombre de etiqueta (como `div` o `span`), un tipo de componente (una clase o una función) o un tipo de fragmento.';

const TYPE_RENDER_NOTHING = 'Boolean, null o undefined no son renderizados';
const TYPE_RENDER_NO_SUPPORTED = 'El render type no esta soportado';

export {
    CONTAINER_NO_SUPPORTED,
    PROPS_NO_SUPPORTED,
    TYPE_NO_SUPPORTED,

    TYPE_RENDER_NOTHING,
    TYPE_RENDER_NO_SUPPORTED
};
