# IA local en el navegador (sin modelos de pago)

## Objetivo
Dejar de usar servicios de IA de pago. Las preguntas se generan y el writing se corrige dentro del navegador de cada persona. El profesor sigue escogiendo temas, nivel MCER, habilidades, número de preguntas y límite de palabras.

## Cómo funcionará (híbrido)
1. **Banco de preguntas + plantillas (siempre disponible, 0 MB)**
   - Viene incluido en la app: textos y ejercicios organizados por tema y por nivel (A1 a C2).
   - Sirve para Reading, Listening, Fill in the blank, consignas de Writing y párrafos de Speaking.
   - Respeta el número de preguntas y las reparte por igual entre las habilidades seleccionadas.
2. **IA local opcional (más variedad)**
   - Si el equipo lo permite (Chrome o Edge con aceleración gráfica), al pulsar "Generar con IA" se ofrece descargar un modelo pequeño de unos 400 a 900 MB. Se descarga una sola vez y queda guardado en el navegador.
   - La IA crea preguntas nuevas siguiendo el tema y el nivel MCER. Si falla o devuelve algo inválido, la app usa el banco automáticamente.
   - Mientras se descarga y se genera, se muestra una barra de progreso.
3. **Corrección del writing (sencilla y local)**
   - Siempre: revisa la ortografía con un diccionario, cuenta palabras, detecta qué temas usó (con palabras clave y estructuras por tema) y da una nota del 0 al 10.
   - Si la IA local ya está descargada en ese equipo, añade un comentario corto de retroalimentación.
   - Los resultados se guardan igual que ahora, así el profesor sigue viendo los errores en su panel.

## Qué no cambia
Registro e inicio de sesión de los profesores, cuestionarios propios por profesor, publicación y enlace, audio de listening con su velocidad, speaking calificado por el profesor y resultados finales.

## Limitaciones a tener en cuenta
- En equipos sin aceleración gráfica (o en muchos celulares) solo se usa el banco de preguntas, que funciona bien pero ofrece menos variedad.
- La IA pequeña puede producir preguntas más simples que la de pago. Por eso todo lo que genera se valida antes de guardarlo.

## Detalles técnicos
- Uso de `@mlc-ai/web-llm` (WebGPU), con el modelo `Qwen2.5-0.5B-Instruct-q4f16_1-MLC` por defecto, que funciona como Web Worker. Se detecta `navigator.gpu` para decidir si se ofrece.
- Nuevo `src/lib/localAI/`: `questionBank.ts` (datos por tema y nivel), `templateGenerator.ts`, `webllmGenerator.ts` (prompts con reglas MCER que se migran desde la función actual, salida JSON validada con zod), `writingGrader.ts` (diccionario de ortografía con `nspell` + `dictionary-en` cargado bajo demanda, reglas por tema y nota heurística).
- `AdminDashboard.generateQuestions` genera en el cliente e inserta en `questions` con el cliente autenticado (las políticas actuales del dueño lo permiten).
- `QuizTake` llama a `writingGrader` localmente y guarda `writing_feedback` por medio del cliente público. Si hace falta, se añade una política de actualización limitada para `anon`.
- Se eliminan las funciones `generate-questions` y `grade-writing`.
- Pruebas: reparto equitativo de preguntas, el respaldo con el banco cuando la IA falla, y la nota de writing con 0 si el texto está vacío.
