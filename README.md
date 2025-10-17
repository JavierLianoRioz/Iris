# Iris 🪻

Este es un proyecto universitario que busca solucionar un problema claro que tenemos los estudiantes, la perdida de información y la poca claridad de ella al recibir un correo.

## Problema

La situación es la siguiente: 
Te llega un correo como el siguiente 
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
¿Es poco legible? Realmente no sirve de mucho, no nos informa casi de nada y encima tenemos que hacer un esfuerzo en entender de qué clase es, cuál es el contexto, de qué habla el correo, quién lo ha enviado, etc.

## Solución

La optativa por la que optamos es la siguiente:
Te llagaría un mensaje a whatsapp con la siguiente información:
```
[Profesor], profesor de [asignatura], ha cambiado los temas de estudio para los Quiz y Parcial.
```

### Un giro más
Pero la cosa no queda aquí, sino que nuestro sistema es totalmente flexible. Dependiendo del correo sabrá qué decir, qué destacar y de qué informar.

## ¿Cuál sería nuestra hoja de ruta?

- [x] recibir correos de gmail.
- [x] filtrar correos por etiquetas de gmail.
- [x] enviar mensajes a usuarios y/o grupos de whatsapp
- [x] transcripción y aclaración de los temas.
- [ ] comprensión del contexto del correo fuera de lo que el propio correo menciona.
- [ ] filtrar los correos no deseados. [hoja de resolución](./Filtro_Correos_Primera_Iteracion)
- [ ] mvp abierto a uso para más personas.

## ¿Cómo aportar al proyecto?

Si teneis sugerencias para el proyecto os agradecería que pusieraís [issues](https://www.github.com/javierlianorioz/proyecto-iris/issues) con el fin de mejorar el enfoque de este y su futuro. <3
