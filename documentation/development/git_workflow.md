# Git Workflow and Branching Convention

To maintain the project organized and ensure a stable and clear version history, we will follow a branching model based on GitFlow.

### Main Branches

The repository has two main long-lived branches with specific roles:

*   **`main`**: This is the production branch. It must always be stable and ready for deployment. Code is only merged into `main` from `develop` (for new releases) or `hotfix` branches. **Direct commits to `main` are not allowed.**
*   **`develop`**: This is the main development branch. It serves as an integration point for all new features and fixes. All topic branches are created from and merged back into `develop`.

### Topic Branches (Naming Convention)

For day-to-day work, create a new branch from `develop` following this naming convention:

**`type/short-description`**

The `type` specifies the kind of work being done:

*   **`feat`**: For a new **feature**.
    *   *Example:* `feat/google-authentication`
*   **`fix`**: For a **bug fix**.
    *   *Example:* `fix/form-submission-error`
*   **`refactor`**: For code changes that neither add a feature nor fix a bug.
    *   *Example:* `refactor/simplify-user-service`
*   **`docs`**: For changes to **documentation**.
    *   *Example:* `docs/update-readme-setup`
*   **`style`**: For code **style** changes (formatting, etc.).
    *   *Example:* `style/format-backend-files`
*   **`test`**: For adding or modifying **tests**.
    *   *Example:* `test/add-subscription-tests`
*   **`chore`**: For routine **maintenance** tasks (e.g., updating dependencies).
    *   *Example:* `chore/update-react-version`

### Workflow Summary

1.  **Feature Development**:
    *   Create your branch from `develop`: `git checkout -b feat/my-new-feature develop`
    *   When finished, merge it back into `develop`: `git checkout develop && git merge feat/my-new-feature`
2.  **Release**:
    *   When `develop` is stable and ready for a release, merge it into `main`: `git checkout main && git merge develop`
3.  **Hotfix (Urgent Production Fix)**:
    *   Create your branch from `main`: `git checkout -b hotfix/critical-bug main`
    *   When finished, merge it into **both** `main` and `develop`.

### Issue Branching Workflow

To manage work related to specific issues, we will follow this workflow:

1.  **Issue Branch Creation**: When starting work on an issue, create a dedicated branch from `develop` named `issue/<issue-number>-<short-description>`.
    *   *Example:* `issue/33-implement-health-checks`
2.  **Feature/Fix/Docs Branches**: From this `issue` branch, create further topic branches (e.g., `feat/`, `fix/`, `docs/`) for individual changes related to that issue, following the existing naming conventions.
3.  **Merging Topic Branches**: Merge these topic branches back into their parent `issue` branch.
4.  **Pull Request for Issue**: Once all work for an issue is complete and all its related topic branches have been merged into the `issue` branch, create a Pull Request (PR) from the `issue` branch to `develop`.
5.  **PR Closure and Issue Resolution**: The PR for the `issue` branch will only be closed once all associated topic branches are closed and merged. Closing this PR will automatically close the corresponding issue.

### Granularidad de los Commits

Es crucial mantener un alto nivel de granularidad en los commits. Cada commit debe representar un cambio único, lógico y atómico. Evita agrupar múltiples cambios no relacionados en un solo commit.

**Directrices:**
*   **Responsabilidad Única:** Cada commit debe abordar una tarea específica, una corrección de error o un incremento de funcionalidad.
*   **Testeable:** Idealmente, el código en cada commit debería ser testeable y dejar el proyecto en un estado funcional.
*   **Progreso Incremental:** Divide las tareas grandes en commits más pequeños y manejables. Por ejemplo, si implementas una funcionalidad, separa los commits para:
    *   Andamiaje inicial
    *   Cambios en el esquema de la base de datos
    *   Implementación de endpoints de API
    *   Lógica de negocio
    *   Tests
*   **Mensajes Descriptivos:** Los mensajes de commit deben explicar claramente *qué* se cambió y *por qué*.