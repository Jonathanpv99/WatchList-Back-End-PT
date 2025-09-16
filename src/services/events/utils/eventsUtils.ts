import OpenAI from "openai";
import { Severity } from "../../../generated/prisma";
import logger from "../../../utils/logger";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Función para registrar la interacción
function logPrompt(prompt: string, response: string) {
  const logFilePath = path.join(__dirname, "PROMPT_LOG.md");

  // Formato que quieres en Markdown
  const logEntry = `
### ${new Date().toISOString()}

**Prompt:**  
\`\`\`
${prompt}
\`\`\`

**Respuesta IA:**  
\`\`\`
${response}
\`\`\`

---
`;

  // Append al archivo (lo crea si no existe)
  fs.appendFileSync(logFilePath, logEntry, { encoding: "utf8" });
}

async function processEventsWithAI(
  terms: string[],
  eventos: string[],
  watchlistId: string,
  correlationId?: string
): Promise<
  Array<{
    message: string;
    summary?: string;
    severity?: Severity;
    suggestion?: string;
    watchlistId: string;
  }>
> {
  const prompt = `Analiza los siguientes eventos y los terminos relacionados al evento y responde estrictamente en JSON.
Eventos: ${JSON.stringify(eventos)}
Terminos: ${JSON.stringify(terms)}

Para cada evento devuelve un objeto con:
-message: el mensaje original del evento
-summary: sera un resume corto
-severity: (LOW, MED, HIGH, CRITICAL)
-suggestion: una sugerencia corta para resolver el evento o evitar que se repita

La respuesta debe ser un arreglo JSON de la misma longitud que los eventos.`;
  try {
    logger.info({ correlationId }, "send prompt to openai");
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Eres un asistente que analiza eventos de ciberseguridad.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const rawMessage = response.choices[0].message.content;

    // Registrar el prompt y la respuesta
    logPrompt(prompt, rawMessage || "");

    const resp = JSON.parse(rawMessage!);

    return resp.map((item) => ({
      ...item,
      watchlistId,
    }));

    return resp;
  } catch (error: any) {
    //aqui deberia hacer type guard.
    logger.warn(
      { correlationId, error: error.message },
      "Error al procesar eventos con OpenAI, usando respaldo"
    );

    // Generar datos de prueba, si open ia devuelve un error, tokens terminados.
    return generarDatosRespaldo(eventos, watchlistId, prompt);
  }
}

// Función para generar datos de respaldo cuando falla OpenAI
function generarDatosRespaldo(
  eventos: string[],
  watchlistId: string,
  prompt: string
): Array<{
  message: string;
  summary?: string;
  severity?: Severity;
  suggestion?: string;
  watchlistId: string;
}> {
  const data = eventos.map((evento) => ({
    message: evento,
    summary: "Evento de seguridad detectado",
    severity: Severity.MED,
    suggestion: "Revisar logs del sistema y verificar actividad sospechosa",
    watchlistId,
  }));

  const dataString = JSON.stringify(data);

  // Registrar el prompt y la respuesta
  logPrompt(prompt, dataString);

  return data;
}

export { processEventsWithAI };
