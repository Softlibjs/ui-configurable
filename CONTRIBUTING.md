# Contribuir al Proyecto

¡Gracias por tu interés en contribuir!

Este documento describe el flujo de trabajo y las reglas para colaborar en este proyecto.

---

## Flujo de trabajo con Git

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/tu-repo.git
   cd tu-repo
   ````

2. **Crea una rama para tu contribución**

   ```bash
   git checkout -b feature/nombre-de-tu-feature
   ```

   Usa el prefijo adecuado:

   * `feature/` para nuevas funcionalidades.
   * `fix/` para correcciones de bugs.
   * `chore/` para cambios menores o de mantenimiento.
   * `docs/` para cambios de documentación.

3. **Haz commits claros y atómicos**

   ```bash
   git add .
   git commit -m "feat: descripción breve del cambio"
   ```

   Sigue [Conventional Commits](https://www.conventionalcommits.org/):

   * `feat:` nueva funcionalidad
   * `fix:` corrección de error
   * `docs:` documentación
   * `style:` cambios de formato (sin afectar lógica)
   * `refactor:` refactorización de código
   * `test:` pruebas
   * `chore:` tareas de mantenimiento

4. **Sincroniza tu rama antes de hacer un PR**

   ```bash
   git fetch origin
   git rebase origin/main
   ```

5. **Crea un Pull Request**

   * Explica claramente el propósito.
   * Adjunta capturas o ejemplos si aplica.
   * Relaciona el issue correspondiente (`Closes #N`).

---

## Reglas de estilo

* Sigue la guía de estilo definida en el proyecto (ejemplo: ESLint, Prettier, StyleCop).
* Escribe nombres claros y consistentes.
* Documenta funciones y clases públicas.

---

## Pruebas

Antes de enviar un PR asegúrate de:

```bash
# Ejemplo
npm test
# o
dotnet test
```

---

## Gracias

Toda contribución es bienvenida.
