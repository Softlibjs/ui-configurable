# Virtual DOM

**Primeros pasos**

* Renderizando elementos en el DOM
* Elementos funcionales `Component` que nos permitan interactuar con las `props`
* Resolver la inmutabilidad y permitir que el DOM se actualice

---

### Versiones

#### [0.1.0] - Renderizado con `innerHTML`
En la primera versión, la forma más simple de mostrar contenido en la página era utilizando `innerHTML`.

**Fortalezas:**
* Sencillo y directo.

**Problemas:**
* **Inseguridad:** Es vulnerable a ataques de inyección de código (XSS).
* **Inmutabilidad:** El contenido es estático y no puede ser actualizado dinámicamente.
* **Falta de semántica:** No podemos pasar propiedades o manejar eventos de manera organizada.

---

#### [0.2.0] - Representación con objetos
Para mejorar la estructura, representamos los elementos HTML como objetos JavaScript.

**Fortalezas:**
* Mejora la semántica y la organización del código.
* Nos permite definir un árbol de elementos anidado.

**Problemas:**
* **Aún inmutable:** Una vez creado, el objeto no puede ser modificado. Para cualquier cambio, hay que redibujar todo el árbol.

---

#### [0.3.0] - Introducción de Componentes
Se introduce la capacidad de manejar componentes funcionales. Ahora, `createElement` puede aceptar tanto una cadena (como `'div'`) como una función, lo que nos permite crear componentes reutilizables. Esto resuelve el problema de la falta de un patrón funcional para crear elementos.

**Fortalezas:**
* **Modularidad:** Permite crear componentes funcionales reutilizables.
* **Flujo de renderizado recursivo:** Se crea un árbol en memoria que representa los componentes y elementos.

**Problemas:**
* **Inmutabilidad persistente:** A pesar de tener componentes, no existe un mecanismo para actualizar el estado internamente. Para cualquier cambio, el componente debe ser montado de nuevo.

---

#### [0.4.0] - Estado y Ciclo de Vida (Hooks)
Se añaden `useState` y `useEffect`, una arquitectura de ganchos (hooks) que permite a los componentes tener su propio estado interno y manejar efectos secundarios (como temporizadores y llamadas a APIs).

**Fortalezas:**
* **Reactividad:** Los componentes ahora pueden actualizarse en respuesta a cambios de estado.
* **Efectos secundarios:** Permite gestionar tareas como la limpieza de recursos.
* **Fugas de memoria:** La función de limpieza de `useEffect` evita que los temporizadores y otros efectos sigan ejecutándose después de que el componente es eliminado.

**Problemas:**
* **Contexto global:** La implementación actual de los hooks depende de variables globales (`currentComponent` y `hookIndex`), lo que puede causar errores en entornos asincrónicos, mezclando los estados de diferentes componentes si no se maneja cuidadosamente.

---

#### [0.5.0] - Reconciliación, `Keys` y Tipos de Hijos
Se implementa un algoritmo inicial de reconciliación (`diffing`) para comparar el estado anterior y el nuevo, y se introducen las `keys` para identificar los elementos en una lista. También se mejora la función de renderizado para manejar múltiples tipos de hijos.

**Fortalezas:**
* **Reconciliación:** La aplicación ahora solo actualiza los nodos del DOM que han cambiado, en lugar de borrar y recrear todo el árbol.
* **Compatibilidad:** Maneja correctamente una mezcla de diferentes tipos de hijos (`string`, `number`, `boolean`, `null`, `componente`, `etiqueta`).
* **Manejo de `keys`:** El algoritmo ahora reconoce la propiedad `key` en los elementos.

**Problemas:**
* **Reordenamiento de `keys`:** El algoritmo de reconciliación no está optimizado para reordenar los nodos. Cuando se ordena una lista, los elementos del DOM no cambian de posición, lo que puede causar que el estado (por ejemplo, el texto en un `input`) se mezcle entre diferentes filas.

