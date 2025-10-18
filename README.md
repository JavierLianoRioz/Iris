# Iris 🪻

Iris es un proyecto universitario diseñado para resolver un problema común entre los estudiantes: la pérdida de información y la falta de claridad en los correos electrónicos relacionados con las asignaturas.

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

Este mensaje es preciso, fácil de entender y proporciona solo la información esencial. Pero eso no es todo: el sistema es flexible y se adapta al contenido del correo, destacando solo lo más relevante y proporcionando un resumen adecuado.

### Hoja de ruta

* [x] Recibir correos desde Gmail.
* [x] Filtrar correos por etiquetas de Gmail.
* [x] Enviar mensajes a usuarios y/o grupos de WhatsApp.
* [x] Transcripción y aclaración de los temas.
* [ ] [Comprensión del contexto del correo fuera de lo que el propio correo menciona.](https://github.com/JavierLianoRioz/Proyecto-Iris/issues/2)
* [ ] [Filtrar correos no deseados.](https://github.com/JavierLianoRioz/Proyecto-Iris/issues/1)
* [ ] Publicar MVP accesible para más usuarios.

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

Para facilitar el proceso, se han incluido scripts de inicio:

*   **En Windows:** Simplemente ejecuta el archivo:
    ```sh
    .\start.bat
    ```
*   **En Linux o macOS:** Primero da permisos de ejecución al script y luego ejecútalo:
    ```sh
    chmod +x start.sh
    ./start.sh
    ```

Estos scripts levantarán todos los servicios en segundo plano (`-d`).

### 3. Detener la Aplicación

Para detener todos los servicios, puedes usar el siguiente comando desde la carpeta `compose/`:

```sh
docker-compose --env-file ../.env down
```

## ¿Cómo contribuir?

Si tienes sugerencias para mejorar Iris o deseas aportar al proyecto, te agradeceríamos que crees un [issue en GitHub](https://github.com/JavierLianoRioz/Proyecto-Iris/issues). ¡Nos encantaría recibir tu retroalimentación y contribuciones!

## Agradecimientos

Queremos agradecer a todas las personas que han colaborado con opiniones y sugerencias:

* [Manuel Masias](https://manuel.masiasweb.com/)