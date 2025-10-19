# Iris 🪻

<table>
  <tr>
    <td width="30%" valign="top">
      <img src="img/iris.png" alt="Logo de Iris" width="100%">
    </td>
    <td valign="top">
      <p>En el torbellino de la comunicación académica, donde los mensajes importantes se pierden como susurros en una tormenta, nace <strong>Iris</strong>. Inspirada en la <strong>mensajera de los dioses</strong>, este proyecto transforma el <strong>caos en claridad</strong>, llevando la <strong>esencia de cada mensaje</strong> directamente a ti.</p>
    </td>
  </tr>
</table>

## Problema

Cuando recibimos correos como el siguiente:

```
CSJ038-v1||2025: Re: [XXX] [YYY] Fechas importantes de la asignatura
[Nombre Oculto] (vía [Nombre Universidad]) <noreply@[dominio].es>

lun, 13 oct, 18:46 (hace 4 días)

para mí

[XXX]||[AAAA] » Foros » Comunicaciones docentes » [XXX] [YYY] Fechas importantes de la asignatura
[Iniciales del Remitente]
Re: [XXX] [YYY] Fechas importantes de la asignatura
de [Nombre Oculto] - [Día de la semana], [DD] de [Mes] de [AAAA], [HH]:[MM]

Actualizados los temas de estudio de cada Quiz y Parcial

Mostrar mensaje anterior
Ver el mensaje en su contexto
Dar de baja mi suscripción a este foro Dar de baja mi suscripción a esta discusión Cambie sus preferencias de resumen del foro
```

El correo es demasiado largo, poco legible y difícil de interpretar. Nos cuesta entender de qué clase se trata, quién lo envió, qué información es relevante, etc. Es común perder detalles importantes y no entender con claridad el contenido.

## Solución

Iris ofrece una solución simple y efectiva. En lugar de recibir correos largos y difíciles de interpretar, recibirás un mensaje claro y directo en tu WhatsApp, como el siguiente:

```
[Profesor], profesor de [asignatura], ha actualizado los temas de estudio para los Quiz y Parcial.
```

Preciso, elegante y directo. Iris se asegura de que solo recibas la esencia, permitiéndote actuar con conocimiento y serenidad.

### El Viaje de Iris

El desarrollo de Iris es una odisea en sí misma, marcada por eras que definen su evolución.

#### Las Eras Celestiales

*   **Whisper of the Gods** — *(Fase Actual)* Fase alfa de comunicación inicial y forja del núcleo del proyecto.
*   **Golden Messenger** — Versión beta, donde Iris expandirá sus habilidades y ganará robustez.
*   **Rainbow Path** — Una fase de transición y enlace, enfocada en la integración y la preparación para su ascensión.
*   **Celestial Call** — La fase final, el lanzamiento público, con un sistema pulido y listo para una audiencia general.

## Despliegue con Docker

Este proyecto está configurado para funcionar con Docker y Docker Compose, lo que simplifica enormemente su despliegue.

### Prerrequisitos

*   Tener instalados [Docker](https://www.docker.com/products/docker-desktop/) y Docker Compose.

### 1. Configuración Inicial

Antes de lanzar la aplicación por primera vez, necesitas configurar tus variables de entorno:

1.  Copia el archivo `.env.example` y renómbralo a `.env`.
2.  Abre el archivo `.env` y revisa todas las variables. Asegúrate de cambiar las contraseñas y la API key por valores seguros:
    *   `POSTGRES_PASSWORD`
    *   `REDIS_PASSWORD`
    *   `AUTHENTICATION_API_KEY`

### 2. Iniciar la Aplicación

Para facilitar el proceso, todos los scripts se encuentran en la carpeta `scripts/`.

*   **En Windows:**
    ```sh
    .\scripts\start.bat
    ```
*   **En Linux o macOS:**
    ```sh
    chmod +x scripts/start.sh
    ./scripts/start.sh
    ```
Estos scripts levantarán todos los servicios en segundo plano (`-d`).

### 3. Gestión del Entorno (Backup, Restore y Apagado Seguro)

Para evitar la pérdida de datos de la base de datos, se ha implementado un sistema de backup y restauración.

#### **Apagado Seguro (Recomendado)**

**¡IMPORTANTE!** Para detener y limpiar el entorno de forma segura, **utiliza siempre los scripts `safe-down`**. Estos scripts crean un backup completo de las bases de datos antes de eliminar los volúmenes de datos.

*   **En Windows:**
    ```sh
    .\scripts\safe-down.bat
    ```
*   **En Linux o macOS:**
    ```sh
    ./scripts/safe-down.sh
    ```

#### **Backup y Restauración Manual**

Si solo quieres hacer un backup o restaurar datos sin detener el entorno, puedes usar los siguientes scripts:

*   **Crear un Backup:**
    ```sh
    # Windows
    .\scripts\backup.bat

    # Linux/macOS
    ./scripts/backup.sh
    ```
    Esto guardará un respaldo de las bases de datos `iris`, `n8n` y `evolution` en la carpeta `backups/`.

*   **Restaurar desde un Backup:**
    ```sh
    # Windows
    .\scripts\restore.bat

    # Linux/macOS
    ./scripts/restore.sh
    ```
    Esto restaurará el último backup encontrado para cada base de datos. El script esperará a que la base de datos esté lista antes de intentar la restauración.

## ¿Cómo contribuir?

Si tienes sugerencias para mejorar Iris o deseas aportar al proyecto, te agradeceríamos que crees un [issue en GitHub](https://github.com/JavierLianoRioz/Iris/issues). ¡Nos encantaría recibir tu retroalimentación y contribuciones!

## Agradecimientos

Queremos agradecer a todas las personas que han colaborado con opiniones y sugerencias:
* [Manuel Masias](https://manuel.masiasweb.com/)
