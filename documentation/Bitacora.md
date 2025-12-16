# Bitácora

## Cambios pasados

A la hora de escribir este documento ya he hecho un intento de realizar el proyecto, en bruto, directo, sin planificación previa. El resultado fue un desastre, pero sirvió para aprender mucho sobre lo que no se debe hacer y lo que se debe tener en cuenta. Sobre todo a la hora de seleccionar las tecnologías a utilizar y el como plantearlas.
También he recibido recomendaciones de reencarnar este proyecto sin prisas, con planificación y con un enfoque más profesional. Sobre todo teniendo en cuenta que no a de ser perfecto, pero si funcional, sostenible, mantenible y comprensible.
Por lo tanto, este documento servirá para llevar un registro de los cambios y decisiones tomadas a lo largo del desarrollo del proyecto a partir de hoy (19/11/2025).

## Historial

### 19/11/2024 - Inicio de la bitácora.

Decidido reencarnar el proyecto desde cero, con planificación y sin prisas.

Empezaré creando una serie de documentos que recojan el funcionamiento y planificación del proyecto:

- [Contexto del Sistema](<Contexto del Sistema.md>)
- [Arquitectura](Arquitectura.md)
- [Flujo de Suscripción](<Flujo de Suscripcion.md>)
- [Flujo de envio](<Flujo de Envio.md>)
- [Base de Datos](<Base de Datos.md>)

### 29/11/2025 - Desarrollo del Frontend (Web)

Se ha desarrollado desde cero la interfaz web del sistema utilizando Astro, React y Tailwind CSS. Se ha implementado el sistema de autenticación con Google, el dashboard de usuario, la gestión de suscripciones y el onboarding de teléfono.

Detalles completos en: [Logs: Desarrollo Frontend](journal/2025-11-29_Frontend_Development.md)

### 30/11/2025 - Integración Docker, Evolution API y Correcciones Críticas

#### Infraestructura y DevOps

- **Docker Compose completo**: Configurado entorno completo con 9 servicios (Backend, Frontend, PostgreSQL, n8n, Redis, Evolution API, pgAdmin, Nginx proxy, Ngrok)
- **Ngrok**: Configurado túnel público con dominio estático (`rowan-courtly-milena.ngrok-free.dev`) para exponer la aplicación
- **Nginx Proxy**: Implementado proxy reverso para enrutar peticiones a frontend (`/`), backend (`/api/`) y webhooks n8n (`/webhook/`)

#### Evolution API (WhatsApp)

- Integrado Evolution API v2.2.2 para gestión de mensajes de WhatsApp
- Configuración con PostgreSQL y Redis para persistencia y caché
- Documentación en `Evolution API.md` con guías de configuración y uso

#### Backend

- Actualizado modelo de usuarios y endpoints para soportar gestión de perfil
- Endpoint `/users/{email}` para obtener información de usuario registrado
- Endpoint `/subscribe` para crear/actualizar suscripciones con nombre, teléfono y asignaturas
- Sistema de sincronización de datos usuario entre Google Auth y base de datos

#### Frontend - Correcciones Críticas

1. **Fix 502 Bad Gateway**: Resuelto error de compilación por imports incorrectos del componente `Modal`
   - Corregido en `PhoneOnboardingModal.tsx` y `EditProfileModal.tsx`
   - Cambiado de default import a named import: `import { Modal } from '../ui/Modal'`
2. **Fix Lógica de Nombre de Usuario**:

   - Problema: Frontend mostraba nombre de Google en lugar del nombre de la base de datos para usuarios registrados
   - Solución: Actualizado `useUser.ts` para sincronizar el campo `name` desde el backend
   - Ahora el nombre almacenado en la base de datos tiene prioridad sobre el nombre de Google

3. **Mejoras UI**:
   - Modales de edición de perfil y onboarding de teléfono
   - Hook personalizado `useUser` para gestión de estado de usuario
   - Hook `useSubjects` para manejo de suscripciones

#### Verificación y Deployment

- Actualizado y verificado sistema Docker completo sin errores
- Todos los servicios funcionando correctamente con health checks
- URL pública accesible y funcional
- Merge exitoso de `develop` a `main`

**Commits del día:**

- `1b03d73`: Configuración entorno Docker para integración full stack
- `0003b15`: Actualización modelo usuario y endpoints backend
- `11ebe12`: Añadidos servicios ngrok y proxy a docker-compose
- `5fef809`: Mejoras componentes UI frontend con diseño premium
- `1cbf417`: Gestión perfil usuario con modales onboarding y edición

### 09/12/2025 - Correcciones y Mejoras de Infraestructura

**Commits del día:**

- `b866d1f`: Actualización de reglas y documentación.
- `80bf63f`: Fix Nginx proxy para resolución dinámica de DNS.

### 30/11/2025 - Refactorización de Servicios

**Commits del día:**

- `612ff16`: Refactor: Move subject logic to service layer.

### 12/12/2025 - Actualización de Documentación y Limpieza

Se ha realizado una revisión y actualización de la documentación del proyecto para reflejar el estado actual del sistema, corrigiendo discrepancias en la arquitectura y los puertos utilizados.

**Cambios Realizados:**

- Actualización de `Arquitectura.md`:
  - Inclusión de capa Gateway (Ngrok + Nginx) en diagrama y tabla de puertos.
  - Actualización de la tabla de puertos para reflejar todos los servicios.
- Actualización de `README.md`: Mención explicita de Nginx en el resumen de arquitectura.
- Actualización de `Bitacora.md`: Registro de cambios.

**Commits Recientes:**

- `b866d1f`: Actualización de reglas de código limpio y tema oscuro.
- `0f8abfd`: feat(backend): añadido endpoint para eliminar usuarios.
- `32c2c87`: Añadido banner al README.

**Estado Actual:**

### 12/12/2025 - Gran Migración a AstroJS Fullstack

Se ha completado una reestructuración mayor de la arquitectura del proyecto, eliminando el servicio de backend en Python (FastAPI) y consolidando toda la lógica en el Frontend con AstroJS (SSR).

**Cambios Principales:**

1.  **Unificación del Stack**:

    - Backend Python eliminado.
    - Frontend ahora maneja la API REST y la conexión a Base de Datos.
    - Uso de **Astro SRR** con adaptador Node.js.

2.  **Capa de Datos**:

    - Implementación de **Drizzle ORM** para consultas Type-Safe.
    - Cliente Postgres-JS.
    - Soporte para transacciones y cascadas (`ON DELETE CASCADE` parchado en DB).

3.  **Clean Code & Refactor**:

    - Servicios (`src/services/`) desacoplados de los controladores.
    - Código auto-descripivo sin comentarios redundantes en el frontend.
    - Refactorización de `subscription.ts` y `users.ts` siguiendo principios SOLID/DRY.

4.  **Testing (TDD)**:

    - Implementación de **Vitest** para tests de integración.
    - Tests creados _antes_ de la migración de endpoints para asegurar paridad.
    - Cobertura de flujos críticos: Creación de asignaturas, Suscripción de usuarios (transaccional), Borrado de usuarios.

5.  **Infraestructura**:
    - Simplificación de `docker-compose.yml` (1 servicio menos).
    - Ajuste de Nginx para proxying interno eficiente.
    - Solución de problemas de conectividad IPv6/Loopback en contenedores Docker.

**Estado Final**: El sistema es ahora más ligero, mantenible y utiliza un único lenguaje (TypeScript) para todo el stack web.

### 16/12/2025 - Refactorización de Esquema de Base de Datos (Mailbox Architecture)

Se ha rediseñado la capa de persistencia de mensajes para soportar un modelo más robusto y escalable, separando la fuente de los mensajes de su contenido y su entrega.

**Cambios Realizados:**

1.  **Arquitectura de Buzón (Mailbox)**:

    - **`correos`** (antes `mensajes`): Almacena solo la metadata del email original (remitente, asunto, cuerpo).
    - **`mensajes`** (Nueva): Almacena el contenido procesado/formateado. Relación 1:1 opcional con `correos`.
    - **`buzon`** (antes `mensajes_enviados`): Tabla pivote para gestionar entregas (N:M). Soporta `external_id` (WhatsApp ID) y estados individuales por usuario.

2.  **Migración ACID y UTF-8**:

    - Se ejecutó un script de migración transaccional (`BEGIN...COMMIT`) para asegurar cero pérdida de datos.
    - Preservación de IDs para mantener integridad referencial automática.
    - Soporte explícito para caracteres UTF-8 (tildes, ñ) en todo el proceso.

3.  **Limpieza y Normalización**:
    - Eliminación de campos redundantes (`mensaje_formateado` en tabla origen).
    - Estandarización de timestamps (`DEFAULT NOW()`).
    - Constraints `ON DELETE CASCADE` para auto-limpieza de datos.

**Documentación Actualizada:**

- `Base de Datos.md`: Nuevo diagrama ER reflejando el flujo `Usuario` <-> `Buzón` <-> `Mensaje` <-> `Correo`.
