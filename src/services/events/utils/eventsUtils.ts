import OpenAI from "openai";
import { Severity } from "../../../generated/prisma";
import logger from "../../../utils/logger";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
          content: `Analiza los siguientes eventos y los terminos relacionados al evento y responde estrictamente en JSON.
Eventos: ${JSON.stringify(eventos)}
Terminos: ${JSON.stringify(terms)}

Para cada evento devuelve un objeto con:
-message: el mensaje original del evento
-summary: sera un resume corto
-severity: (LOW, MED, HIGH, CRITICAL)
-suggestion: una sugerencia corta para resolver el evento o evitar que se repita

La respuesta debe ser un arreglo JSON de la misma longitud que los eventos.`,
        },
      ],
    });

    const rawMessage = response.choices[0].message.content;

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
    return generarDatosRespaldo(eventos, watchlistId);
  }
}

// Función para generar datos de respaldo cuando falla OpenAI
function generarDatosRespaldo(
  eventos: string[],
  watchlistId: string
): Array<{
  message: string;
  summary?: string;
  severity?: Severity;
  suggestion?: string;
  watchlistId: string;
}> {
  return eventos.map((evento) => ({
    message: evento,
    summary: "Evento de seguridad detectado",
    severity: "MED",
    suggestion: "Revisar logs del sistema y verificar actividad sospechosa",
    watchlistId,
  }));
}

export { processEventsWithAI };
