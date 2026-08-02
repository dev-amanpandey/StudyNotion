const express = require("express");
const { auth } = require("../middlewares/auth");
const {
  getStatus,
  getConversations,
  chat,
} = require("../controllers/aiController");

const router = express.Router();

// Public health/configuration check. It exposes no credentials or course data.
router.get("/status", getStatus);

// Course access checks and Gemini calls will be added with the next AI module phase.
router.get("/conversations", auth, getConversations);
router.post("/chat", auth, chat);

module.exports = router;
