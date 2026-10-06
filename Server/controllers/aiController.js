const { z } = require("zod");
const aiService = require("../services/aiService");

const objectIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid MongoDB id");

const chatRequestSchema = z.object({
  // The dashboard tutor supports general learning questions. Course-player
  // integrations can continue supplying this value for course-aware chat.
  courseId: objectIdSchema.optional(),
  message: z.string().trim().min(1, "Message is required").max(4000),
  conversationId: objectIdSchema.optional(),
  sectionId: objectIdSchema.optional(),
  subSectionId: objectIdSchema.optional(),
});

const conversationQuerySchema = z.object({
  courseId: objectIdSchema,
});

const sendErrorResponse = (res, error) => {
  const statusCode = error.statusCode || 500;
  const message = error.code?.startsWith("AI_")
    ? error.message
    : statusCode >= 500
      ? "Unable to process the AI request"
      : error.message;

  return res.status(statusCode).json({
    success: false,
    message,
    code: error.code,
  });
};

exports.getStatus = (_req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: aiService.getAssistantStatus(),
    });
  } catch (error) {
    console.error("AI_STATUS_ERROR", error);
    return sendErrorResponse(res, error);
  }
};

exports.getConversations = async (req, res) => {
  try {
    const { courseId } = conversationQuerySchema.parse(req.query);
    const data = await aiService.listConversations({
      userId: req.user.id,
      courseId,
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation query",
        errors: error.issues,
      });
    }

    console.error("AI_CONVERSATIONS_ERROR", error);
    return sendErrorResponse(res, error);
  }
};

exports.chat = async (req, res) => {
  try {
    const requestData = chatRequestSchema.parse(req.body);
    const data = await aiService.generateAssistantResponse({
      userId: req.user.id,
      ...requestData,
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid AI chat request",
        errors: error.issues,
      });
    }

    console.error("AI_CHAT_ERROR", error);
    return sendErrorResponse(res, error);
  }
};
