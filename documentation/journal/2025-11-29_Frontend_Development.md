# Desarrollo del Frontend (Web) - 29/11/2025

Se ha iniciado y completado la fase de desarrollo de la interfaz de usuario web para el sistema Iris. El enfoque ha sido crear una **Single Page Application (SPA)** moderna, funcional y visualmente atractiva, centrada en la experiencia de usuario para la gestión de suscripciones.

## Tecnologías Implementadas
*   **Core:** Astro (como framework base) + React (para interactividad).
*   **Estilos:** Tailwind CSS con una arquitectura de diseño "Clean SaaS" (Inter font, glassmorphism, mesh gradients).
*   **Autenticación:** Integración con Google OAuth (@react-oauth/google) y decodificación JWT (jwt-decode).
*   **Persistencia:** LocalStorage para gestión de sesiones client-side.

## Funcionalidades Clave Desarrolladas
1.  **Sistema de Autenticación:**
    *   Login con Google restringido al dominio `@alumnos.uneatlantico.es`.
    *   Validación de dominio en cliente.
    *   Persistencia de sesión automática.
2.  **Dashboard de Estudiante:**
    *   Visualización de perfil con avatar (o fallback a iniciales).
    *   Gestión de suscripciones a asignaturas mediante tarjetas interactivas.
    *   Indicadores de estado del sistema.
3.  **Gestión de Datos de Usuario:**
    *   **Onboarding de Teléfono:** Modal obligatorio para vincular número de WhatsApp al primer inicio.
    *   **Edición de Perfil:** Funcionalidad para modificar nombre y teléfono posteriormente.
    *   Validaciones de formato básicas.

## Arquitectura de Código
Se ha seguido estrictamente el principio de **Clean Code** y **Separation of Concerns**, refactorizando el componente monolítico inicial en componentes reutilizables:
*   `ui/Modal`: Componente genérico para diálogos.
*   `dashboard/UserHeader`: Cabecera con información y acciones de usuario.
*   `dashboard/SubscriptionCard`: Tarjeta individual de asignatura.
*   `dashboard/StatusCard`: Panel lateral de información.

El frontend se encuentra en un estado estable, visualmente pulido y listo para futura integración con el Backend real.
