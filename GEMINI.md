# Iris: El Mensajero Académico Inteligente 🪻

Iris es una plataforma de comunicación avanzada diseñada para transformar la experiencia del estudiante universitario. Su propósito es filtrar el ruido de los correos académicos y entregar notificaciones críticas, re-procesadas mediante IA, directamente a WhatsApp.

---

## 🏗️ Arquitectura de Solución (Stack Tecnológico)

El proyecto se despliega como un ecosistema de microservicios contenedorizados:

-   **Orquestador:** n8n (Lógica de negocio, webhooks y control de flujo).
-   **IA:** OpenRouter (Modelos gratuitos/premium integrados vía LangChain).
-   **Base de Datos:** PostgreSQL (Persistencia, historial de chat JSONB y búsqueda semántica).
-   **WhatsApp:** Evolution API (Puente JID para comunicación en tiempo real).
-   **Backend:** FastAPI (Python) para servicios auxiliares.
-   **Frontend:** React (Dashboard de gestión y perfil de usuario).
-   **Proxy:** Nginx (Servidor de aplicaciones y certificados).

---

## ⚙️ Lógica de Orquestación (n8n)

Iris utiliza un modelo de **Validación en Cascada** para garantizar que ningún mensaje se procese sin un contexto de usuario completo:

1.  **Gatekeeper (`Iris.json`):** Verifica secuencialmente los 4 pilares:
    - ¿Existe el JID? (Auto-registro inicial).
    - ¿Tiene Nombre?
    - ¿Tiene Email validado?
    - ¿Ha verificado su OTP?
2.  **Agente de Registro (`[Registro] Preguntar a la IA`):** Un agente LangChain conversacional que solicita datos faltantes de forma humana.
3.  **Flujo Principal:** Solo accesible para usuarios verificados. Gestiona consultas y suscripciones.

---

## 📊 Modelo de Datos (v2.2 Consonlidado)

Iris migró a una arquitectura de **"JID como Primary Key"** para alinearse con la naturaleza de WhatsApp:

-   **Usuarios:** Clave primaria `jid`. Soporta estado de verificación y metadatos OTP.
-   **Historial (`chat_history`):** Almacena mensajes en formato JSONB para compatibilidad nativa con LangChain. Incluye un trigger de *pruning* que mantiene solo los últimos 15 mensajes por sesión.
-   **Suscripciones Académicas:** Relación N:M entre usuarios y asignaturas, optimizada para búsquedas semánticas mediante la extensión `pg_trgm` y el campo `semantic_keywords`.

---

## 🛡️ Estrategia "Ban-Safe"

Para evitar bloqueos de WhatsApp al usar APIs no oficiales:
-   **Interacción Conversacional:** Se evitan botones o menús interactivos.
-   **Texto Plano:** Todas las confirmaciones se realizan mediante procesamiento de lenguaje natural.
-   **JIDs Sanitizados:** Uso de JIDs oficiales para evitar suplantaciones.

---

## 🚀 Guía de Desarrollo

### Convenciones de Nomenclatura
-   **Flujos n8n:** Siempre usar prefijos entre corchetes: `[Registro]`, `[Académico]`, `[Sistema]`.
-   **Nodos:** Nombres auto-explicativos en español (ej: `¿Tiene email?`).

### Principios de Ingeniería
-   **Clean Code:** Sin comentarios innecesarios, variables descriptivas (`jid` en lugar de `id`).
-   **TDD/SOLID:** Prioridad a la modularidad. Los servicios nuevos se inyectan como herramientas de IA.

---

## 🧠 La "Biblia" de Iris (Visión para el Equipo)

Este apartado contiene todo el conocimiento acumulado, los porqués de las decisiones y la hoja de ruta técnica "sin filtros".

---

### 🏛️ Filosofía de Diseño: El JID como Eje Celestial
En Iris, no existen los "IDs incrementales" para los usuarios. El **JID (WhatsApp ID)** es la única verdad. 
- **Por qué:** Evita desincronizaciones entre la Evolution API y nuestra BD. Si WhatsApp lo conoce, Iris lo conoce.
- **Consecuencia:** Todas las tablas de suscripciones y el historial cuelgan del JID.

### 🤖 N8N como Capa de "API Modular"
No estamos construyendo workflows lineales, estamos construyendo **Servicios**.
- Cada flujo con corchetes (ej: `[Registro]`) debe ser tratado como una función atómica.
- El orquestador `Iris` es el tráfico; los sub-workflows son la lógica. Si algo falla, se arregla en el módulo, no en el orquestador.

### 🔍 El Reto de la Búsqueda Semántica (pg_trgm)
Dado que los estudiantes escriben "Redes", "redes de computadores" o "asignatura de redes", la base de datos utiliza la extensión `pg_trgm`.
- **Regla de Oro:** Siempre usar la columna `semantic_keywords` para alimentar el buscador. No confíes solo en el nombre oficial.

### 🧹 Gestión de Memoria (El Trigger de Pruning)
Para que la IA no se vuelva loca o consuma tokens infinitos, mantenemos un buffer de **15 mensajes**. 
- Hay un trigger en Postgres (`prune_chat_history`) que se encarga de esto. No intentes gestionar la memoria en n8n, confía en la base de datos.
- El formato es **JSONB compatible con LangChain**: `{"data": {"content": "..."}, "type": "ai|human"}`.

---

## 🔮 Futuro y Próximos Pasos (Roadmap Técnico)

1.  **Deep Extraction (Clasificación v3):** Pasar de una clasificación por palabras clave a una extracción profunda de fechas, aulas y profesores directamente desde el cuerpo del correo.
2.  **Human-in-the-Loop:** Crear una herramienta para que, si la IA no identifica una asignatura, se guarde en una tabla de "Pendientes" para revisión manual.
3.  **Dashboard de Métricas:** Reactizar el frontend para ver qué asignaturas son las más deseadas y cuántos mensajes procesa Iris por hora.

---

## 🛑 Reglas Inquebrantables para el Equipo

-   **Clean Code Radical:** Si necesitas poner un comentario, el nombre de tu variable es malo. Cámbialo.
-   **Nomenclatura de Nodos:** Prohibido dejar nombres como `Postgres`, `Postgres1`, `Postgres2`. Usa `[DB] Buscar Usuario`, `[DB] Insertar Log`.
-   **Seguridad WhatsApp:** NUNCA envíes botones. NUNCA envíes menús de lista. Todo debe ser conversacional para mantener a Iris bajo el radar (Estrategia Ban-Safe).

## 🛰️ Bitácora Técnica: Fallos, Soluciones y Razonamientos

En el desarrollo de Iris, hemos tropezado con muros que nos obligaron a repensar la arquitectura. Aquí están las lecciones aprendidas:

### 1. El Gran Desastre de los IDs Incrementales
-   **Fallo:** Inicialmente usamos `SERIAL PRIMARY KEY` para los usuarios. Esto causaba un desastre de sincronización: Evolution API hablaba en JIDs, pero n8n buscaba IDs. Si un registro fallaba a medias, teníamos JIDs vinculados a IDs inexistentes.
-   **Solución:** Eliminamos los IDs autoincrementales. El **JID es la Primary Key**. Es único, es global y es lo único que WhatsApp garantiza. No hay desincronización posible si la clave es la misma en todo el stack.

### 2. La Amnesia de n8n y LangChain
-   **Fallo:** n8n tiene una memoria "volátil". Si el servidor se reiniciaba, la IA olvidaba quién era el usuario. Además, el formato de memoria de n8n no es directamente compatible con una tabla de historial simple.
-   **Solución:** Creamos `chat_history` en Postgres con un trigger (`sync_n8n_memory`). Si n8n escribe un JSON complejo, el trigger extrae el texto plano. Si una herramienta externa escribe texto, el trigger genera el JSON que LangChain espera. Iris ahora tiene "memoria externa" permanente.

### 3. El Error de los Botones (Estrategia Anti-Ban)
-   **Fallo:** En las primeras versiones de Iris v2.0, usamos botones interactivos para el registro. Esto disparaba las alarmas de WhatsApp (las APIs no oficiales + botones son un imán para los bloqueos).
-   **Razonamiento:** Cambiamos a un flujo **100% Conversacional**. Iris no te da botones; Iris te pregunta y entiende tu respuesta. Esto simula un comportamiento humano y mantiene la cuenta "bajo el radar" de Meta.

### 4. La Explosión de Tokens (El Problema del Contexto)
-   **Fallo:** Al guardar todo el historial, los prompts de la IA se volvían gigantes. El costo subía y la IA empezaba a alucinar con mensajes de hace dos días.
-   **Solución:** El **Trigger de Pruning**. Limita automáticamente el historial a los últimos 15 mensajes por usuario. Es el "justo medio" para que la IA tenga contexto reciente sin volverse loca.

### 🔍 Razonamientos sobre la Búsqueda Semántica
No usamos búsquedas exactas (`LIKE`). Los humanos escriben mal. El uso de `pg_trgm` (trigramas) permite que si alguien escribe "Sistemas Operativus", Iris encuentre "Sistemas Operativos". La columna `semantic_keywords` es nuestro "diccionario de sinónimos" para que "Redes" y "Asignatura de Redes de Computadores" sean lo mismo para el motor.

---

## 🛠️ Ejecución Local Rapida

1.  **Docker:** `docker-compose up -d --build`.
2.  **BD:** Revisa `database/scripts` si necesitas entender los cambios de esquema recientes.
3.  **N8N:** Los webhooks de producción están en el túnel, para local usa el `test webhook`.