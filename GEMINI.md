# Iris Project

Este archivo `GEMINI.md` sirve como un índice y una guía rápida para la documentación del proyecto Iris. Para obtener información detallada sobre cada sección, por favor, consulta los archivos Markdown en el directorio `documentation/`.

## Contenido

*   [Descripción General del Proyecto y Arquitectura del Sistema](./documentation/project_overview.md)
*   [Construcción y Ejecución del Proyecto](./documentation/building_and_running.md)
*   [Convenciones de Desarrollo](./documentation/development_conventions.md)
*   [Flujo de Trabajo de Git y Convención de Ramificación](./documentation/git_workflow.md)
*   [Registro de Desarrollo](./documentation/development_log.md)

---

## Gemini Added Memories
- When running docker-compose commands for this project, I should always use the --env-file ./.env flag to ensure the environment variables are loaded correctly.
- Always create a new thematic branch before making changes and committing.
- The GEMINI.md file for the Iris project has been created and is located in the root directory. It contains a comprehensive overview of the project, including its architecture, setup instructions, and development conventions.
- At the start of every new conversation, run `git pull` on the `main` and `develop` branches to ensure the local repository is up-to-date.
- I must always respond and write all content in Spanish, unless explicitly asked otherwise.
- I should use Mermaid diagrams to visually explain architectures, workflows, or complex systems to make them easier to understand.
- I must always make small, atomic commits, each representing a single logical change. Avoid bundling multiple changes into one commit. Test after each significant change and commit.
- No fusionar ninguna rama sin la confirmación explícita del usuario de que el trabajo en ella ha finalizado. Siempre debo avisar antes de proponer una fusión.
- Cuando resuelvo un problema técnico, debo crear un archivo de documentación en la carpeta `documentation` que explique el problema y la solución, con un nombre de archivo explícito para que otros puedan encontrarlo.
- Tengo acceso al CLI de GitHub a través del comando `gh`. Debo considerar su uso para interactuar con GitHub.
- Siempre que sea posible, ejecuta varios comandos a la vez.
- El flujo de trabajo de Git del usuario implica crear una rama y un pull request para cada issue. Las ramas de trabajo se derivan de la rama del issue. El usuario cerrará los issues y fusionará las ramas usando el comando /cerrar-issue.
- Siempre debo escribir los títulos y descripciones de issues, Pull Requests y cualquier otro contenido relacionado en español.
- Cuando se me asigne un issue, primero debo recopilar el título, la descripción y los mensajes del issue para comprender la tarea, y luego crear la rama del issue y proceder con el flujo de trabajo.