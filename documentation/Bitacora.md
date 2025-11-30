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

**Estado actual**: Sistema completamente funcional con todos los servicios integrados, accesible públicamente vía ngrok, y listo para testing de flujo completo.