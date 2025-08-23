# Changelog

Todas las modificaciones notables de este proyecto se documentarán en este archivo.  
El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/)  
y este proyecto sigue [Semantic Versioning](https://semver.org/lang/es/).

---

## [Unreleased]
## [0.2.0] - 2025-08-23
### Added
- Prototipo básico de renderizado con objetos JavaScript:
  - `createDOMElement`: crea nodos del DOM a partir de un objeto declarativo.
  - `render`: monta el árbol en un contenedor dado.
- Soporte para:
  - Nodos de texto y números.
  - Props como atributos/propiedades.
  - Eventos `on*` (ej. onClick).
  - Children recursivos (array o único elemento).

---

## [0.1.0] - 2025-08-23
### Added
- Prototipo inicial con renderizado mediante `innerHTML`.
- Se agrego configuracion de *Vite* para mostrar los ejemplos en la ruta `apps/*.html`.

---

## [0.1.0] - 2025-08-22
### Added
- Proyecto inicial con configuración básica de Git.

---

### Added
- Estructura inicial del proyecto.
- Archivos base: `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`.

---

### Install and Configure
- Creacion del repositorio
  ```bash
  git init
  ```
- Creacion del archivo package.json incial
  ```bash
  npm init --yes
  ```
- Instalación de [Vite]()
  ```bash
  npm install -D vite
  ```
- Instalación de [ESLint]()
  ```bash
  npm install -D eslint
  npx eslint --init
  ```
