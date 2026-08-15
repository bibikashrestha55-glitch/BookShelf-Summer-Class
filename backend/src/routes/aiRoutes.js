const express = require("express");

const {
  getRecommendations,
  chatWithAssistant,
} = require("../controllers/aiController");

const router = express.Router();

router.get("/recommendations", getRecommendations);
router.post("/chat", chatWithAssistant);

module.exports = router;
