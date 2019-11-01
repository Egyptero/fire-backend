const express = require("express");
const router = express.Router();
const { Feedback, validate, validateUpdate } = require("../../models/feedback");
const verifyFeedbackID = require("../../middleware/verifyFeedbackID");
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let feedback = new Feedback(req.body);
  feedback.userId = req.user._id;
  await feedback.save();

  return res.send(feedback);
});

router.put("/:feedbackId", verifyFeedbackID, async (req, res) => {
  const { error } = validateUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const feedback = await Feedback.findByIdAndUpdate(
    req.params.feedbackId,
    req.body,
    {
      new: true
    }
  );
  if (!feedback) return res.status(404).send("feedback id not found");
  return res.send(feedback);
});

router.get("/:feedbackId", verifyFeedbackID, async (req, res) => {
  const feedback = await Feedback.findById(req.params.feedbackId);
  if (!feedback) return res.status(404).send("feedback ID can not be found");
  return res.send(feedback);
});

router.get("/", async (req, res) => {
  const feedbacks = await Feedback.find({ userId: req.user._id });
  return res.send(feedbacks);
});

module.exports = router;
