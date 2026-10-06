const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config({ quiet: true });

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";
const GEMINI_FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL || "gemini-3.5-flash-lite";
let geminiClient;

const createAiError = (message, statusCode, code) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  return error;
};

const getGeminiClient = () => {
  if (geminiClient) return geminiClient;

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw createAiError(
      "The AI service is not configured.",
      503,
      "AI_PROVIDER_NOT_CONFIGURED"
    );
  }

  geminiClient = new GoogleGenAI({ apiKey });
  return geminiClient;
};

const getProviderStatus = (error) =>
  error?.status || error?.statusCode || error?.response?.status || error?.cause?.status;

const normalizeGeminiError = (error) => {
  if (typeof error?.code === "string" && error.code.startsWith("AI_")) return error;

  const providerStatus = getProviderStatus(error);
  const providerMessage = String(error?.message || "").toLowerCase();

  if (
    providerStatus === 401 ||
    providerStatus === 403 ||
    providerMessage.includes("api key") ||
    providerMessage.includes("invalid key") ||
    providerMessage.includes("authentication")
  ) {
    return createAiError(
      "The AI service credentials are invalid or unavailable.",
      503,
      "AI_INVALID_API_KEY"
    );
  }

  if (providerStatus === 429 || providerMessage.includes("rate limit")) {
    return createAiError(
      "The AI service is busy. Please try again shortly.",
      429,
      "AI_RATE_LIMITED"
    );
  }

  if (providerStatus === 503 || providerMessage.includes("high demand")) {
    return createAiError(
      "The AI service is temporarily busy. Please try again shortly.",
      503,
      "AI_PROVIDER_UNAVAILABLE"
    );
  }

  if (
    ["ECONNABORTED", "ECONNREFUSED", "ECONNRESET", "ENOTFOUND", "ETIMEDOUT"].includes(error?.code) ||
    providerMessage.includes("network") ||
    providerMessage.includes("fetch failed") ||
    providerMessage.includes("timeout")
  ) {
    return createAiError(
      "The AI service is temporarily unavailable.",
      503,
      "AI_NETWORK_ERROR"
    );
  }

  return createAiError(
    "The AI service could not generate a response.",
    502,
    "AI_GENERATION_FAILED"
  );
};

exports.getAssistantStatus = () => ({
  provider: "Gemini",
  configured: Boolean(process.env.GEMINI_API_KEY?.trim()),
  model: GEMINI_MODEL,
});

exports.listConversations = async ({ userId, courseId }) => ({
  conversations: [],
  userId,
  courseId,
  message: "Conversation persistence has not been implemented yet.",
});

/**
 * Generates a single non-streaming Gemini response for a user message.
 * Gemini-specific configuration and error handling intentionally stay here.
 */
exports.generateAIResponse = async (message) => {
  if (typeof message !== "string" || !message.trim()) {
    throw createAiError("A non-empty message is required.", 400, "AI_INVALID_MESSAGE");
  }

  try {
    const client = getGeminiClient();
    let response;
    try {
      response = await client.models.generateContent({
        model: GEMINI_MODEL,
        contents: message.trim(),
      });
    } catch (primaryError) {
      if (getProviderStatus(primaryError) !== 503 || GEMINI_FALLBACK_MODEL === GEMINI_MODEL) {
        throw primaryError;
      }

      console.warn("GEMINI_PRIMARY_MODEL_UNAVAILABLE", {
        model: GEMINI_MODEL,
        fallbackModel: GEMINI_FALLBACK_MODEL,
        providerStatus: getProviderStatus(primaryError),
      });
      response = await client.models.generateContent({
        model: GEMINI_FALLBACK_MODEL,
        contents: message.trim(),
      });
    }
    const aiResponse = typeof response?.text === "string" ? response.text.trim() : "";

    if (!aiResponse) {
      throw createAiError(
        "The AI service returned an empty response.",
        502,
        "AI_EMPTY_RESPONSE"
      );
    }

    return aiResponse;
  } catch (error) {
    const normalizedError = normalizeGeminiError(error);
    console.error("GEMINI_GENERATION_ERROR", {
      code: normalizedError.code,
      statusCode: normalizedError.statusCode,
      providerStatus: getProviderStatus(error),
      providerMessage: error?.message,
      stack: error?.stack,
    });
    throw normalizedError;
  }
};

// Retains the existing controller-facing contract while exposing the reusable
// string-only function above for future AI workflows.
exports.generateAssistantResponse = async ({ message }) => ({
  aiResponse: await exports.generateAIResponse(message),
});
