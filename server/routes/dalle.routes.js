import * as dotenv from "dotenv";
import express from "express";
import OpenAI from "openai";

console.log(process.env.OPENAI_API_KEY)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,

});
dotenv.config();
const router = express.Router();
router.route("/").get((req, res) => {
  res.status(200).json({ message: "Hello from Dalle route" });
});

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await openai.images.generate({ model: "dall-e-2", prompt,n: 1, size: "1024x1024",response_format: "b64_json" });
    const image = response.data.data[0].b64_json;
    res.status(200).json({ photo: image });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});
export default router;
