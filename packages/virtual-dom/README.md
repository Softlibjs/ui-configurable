# Virtual DOM

**Primeros pasos**

- Renderizando elementos en el DOM


## Elements

### Renderizando elementos en el DOM

Digamos que queremos mostrar un mensaje **Hola mundo** en un `<div>` que esta en alguna parte de tu pagina HTML.

```html
<div id="root"></div>
```

**Opciones posibles**

- Seleccionar el contenedor `<div>` y utilizar la propiedad `innerHTML`, pero esto nos deja con varios problemas:
  - `innerHTML` es peligroso porque puede incluir codigo no desado (Injection Attacks as XSS cross-site-scripting)
  - no existe una reutilizacion de la etiqueta `<div>`
  - no hay una forma de pasarle propiedades a la etiqueta y el contenido no es dinamico (harcodeado)
  - aunque solo renderizamos texto, un `<div>` puede contener un arbol de lementos
- Representar elemetos HTML mediante objetos JavaScript


### Representar elemetos HTML como objetos JavaScript

Esto nos permite tener una representación de la interfaz de usuario en memoria (algo similar a un "Virtual DOM"), lo que facilita el manejo de cambios y actualizaciones de manera eficiente.

```js
// Note: en luagar de tener un texto con la etiqueta <h1>Hola mundo</h1>
//       temos un objeto al cual podemos manipular para que represente
//       nuestro HTML
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!'
  }
};
```

> [!TIP]
> Piensa en ellos como la representación de lo que tu quieres ver en la pantalla.


### Components and Props

### State and Lifecycle

### Handling Events

### Lists and Keys

### Forms
