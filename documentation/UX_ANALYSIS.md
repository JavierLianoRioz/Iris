# Análisis de Experiencia de Usuario (UX) - Iris 🪻

Este documento detalla el estado actual, la visión proyectada y las recomendaciones estratégicas para transformar el onboarding de Iris en una experiencia de usuario de clase mundial.

---

## 👁️ Visión del Resultado Final
Iris no es solo un bot de notificaciones; es el **asistente académico invisible** que vive en WhatsApp. El resultado final debe ser una herramienta que se sienta proactiva, humana y, sobre todo, que elimine la ansiedad de perderse información crítica.

---

## 📈 Análisis Paso a Paso del Panorama

<details>
<summary><b>1. Identificación del "Aha Moment"</b></summary>

El "Aha Moment" es el instante de revelación donde el usuario comprende el valor único del producto.
- **Definición**: Recibir la primera notificación de una asignatura "ruidosa" (ej: Redes de Computadores) digerida y clara.
- **Problema actual**: Este momento está bloqueado detrás de un muro de registro de 3-5 minutos.
- **Meta**: Reducir el tiempo al "Aha Moment" a menos de 30 segundos.
</details>

<details>
<summary><b>2. Evaluación del Flujo de Registro Actual</b></summary>

El flujo actual es **lineal y burocrático**:
1. El usuario saluda.
2. Iris pregunta el nombre (Fricción).
3. Iris pregunta el email (Fricción).
4. Iris envía un código (Fricción + Cambio de contexto a Gmail).

**Veredicto**: El usuario tiene que "pagar" demasiado esfuerzo antes de ver la "magia".
</details>

<details>
<summary><b>3. Diagnóstico de los Primeros 30 Segundos</b></summary>

Según los principios de onboarding de Grant Lee:
> *"Debemos hacer todo lo posible para que los primeros 30 segundos se sientan mágicos".*

**Estado en Iris**: Los primeros 30 segundos se sienten como un formulario de administración universitaria. Falta el factor "WOW" inicial.
</details>

---

## 💡 Recomendaciones Estratégicas y Acciones

<details>
<summary><b>🚀 Recomendación 1: Valor Inmediato (Demo-First)</b></summary>

**Concepto**: Invertir el embudo. Mostrar qué hace Iris ANTES de preguntar quién es el usuario.

**Acciones Proyectadas**:
- Modificar el mensaje de bienvenida para incluir una notificación de ejemplo real.
- **Captura de Datos**: Una vez mostrada la demo, proceder con la solicitud **obligatoria** de nombre y correo institucional.
- **Resultado esperado**: El usuario completa el registro motivado por lo que acaba de ver, aceptando la fricción necesaria de identificación.
</details>

<details>
<summary><b>🎮 Recomendación 2: Onboarding como Juego (Gamificación)</b></summary>

**Concepto**: Aplicar principios de diseño de juegos para reducir la carga cognitiva.

**Acciones Proyectadas**:
- **Progressive Disclosure**: No pidas el nombre hasta que el email esté verificado.
- **Feedback Visual**: Usar emojis y lenguaje entusiasta ("¡Casi lo tenemos!", "¡Listo para despegar!").
</details>

<details>
<summary><b>🔔 Recomendación 3: Gestión de Expectativas (Bajo Volumen)</b></summary>

**Concepto**: Evitar la sensación de "bot inactivo" debido a la baja frecuencia de mensajes.

**Detalles de Frecuencia**:
- Las notificaciones son un recurso escaso: **máximo 2 al día** y aproximadamente **7 a la semana**.
- **Acción**: Informar explícitamente al usuario durante el onboarding que Iris "solo habla cuando es importante".
- **Resultado**: El usuario valora el silencio como un servicio de filtrado de ruido, no como un fallo del sistema.
</details>

---

## 🗺️ Roadmap de Experiencia de Usuario

1.  **Fase 1 (Inmediata)**: Inyectar una demo en el mensaje inicial.
2.  **Fase 2 (Validación)**: Optimizar el paso del OTP (hacerlo sentir como un "desbloqueo de poder").
3.  **Fase 3 (Retención)**: Implementar confirmaciones de lectura "agradecidas" cuando el usuario interactúa con una notificación.

---

> [!IMPORTANT]
> **Regla de Oro de Iris**: El usuario no debe notar que está hablando con una base de datos. Debe sentir que Iris está ahí para ayudarle a aprobar sus asignaturas.
