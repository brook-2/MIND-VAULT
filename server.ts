import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for AI psychological analysis
  app.post("/api/analyze", async (req, res) => {
    try {
      const { answers, score, categoryScores, currentRank } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      
      // Fallback fallback if key is missing or invalid
      const genericFallback = {
        analysis: `Profiling complete for: ${currentRank || "Strategic Mindset"}.\n\nYour scores show a spectacular synergy: Logic Quotient is exceptional (${categoryScores?.logic ?? 85}%), balanced with deep ${categoryScores?.emotional > 60 ? "empathic emotional guidance" : "calculating pragmatic perception"}. You belong to a rare cognitive bracket which excels under rapid scenario shifts.\n\n- **Cognitive Profile**: Adaptive strategist with robust decision-making speed.\n- **Dominant Trait**: Hyper-focused lateral awareness under mental pressure.\n- **Dilemma Strategy**: Highly ethical yet pragmatically optimal.`,
        quirkyStat: `You think faster than ${Math.min(99, Math.max(85, (score || 72) + 12))}% of peers.`,
        quote: "The mind is its own place, and in itself can make a heaven of hell, a hell of heaven."
      };

      if (!apiKey) {
        return res.json(genericFallback);
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `You are a cognitive profiling AI for the hit Gen Z mobile game "Who Am I?".
The player completed a series of logical trick questions, personality scenarios, speed riddles, and emotional ethical dilemmas.
Here are the game session diagnostics:
- Overall Score: ${score || 75}/100
- Logic/Logical Thinking: ${categoryScores?.logic ?? 70}%
- Emotional Intelligence/EQ: ${categoryScores?.emotional ?? 70}%
- Creative/Lateral Intel: ${categoryScores?.creative ?? 70}%
- Ethical Framework Balance: ${categoryScores?.ethical ?? 70}%
- Assigned Rank: "${currentRank || "Initiate"}"
- Custom Responses Selected: ${JSON.stringify(answers || [])}

Provide an incredibly accurate, witty, slightly roasting but highly empowering visual personality assessment tailored to modern digital natives (Gen Z / tik-tok brains). Use captivating, mysterious phrasing.
Format your output EXACTLY as a JSON object with three keys:
1. "analysis": A comprehensive 3-paragraph profiling (120-150 words). Include custom bold terms (e.g., **Aura Resonance**, **Logical Matrix**) to make it look premium.
2. "quirkyStat": A single funny shareable stat (e.g., "You process logic 94% faster than your friends in group chats").
3. "quote": A mysterious, empowering modern proverb.

Make sure your response contains strictly the JSON object, so it starts with { and ends with } and is valid JSON. Do not write text before or after, and do not put it in backticks.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const resultText = (response.text || "").trim();
      try {
        const parsed = JSON.parse(resultText);
        res.json(parsed);
      } catch (err) {
        res.json({
          analysis: resultText || genericFallback.analysis,
          quirkyStat: genericFallback.quirkyStat,
          quote: genericFallback.quote
        });
      }
    } catch (error: any) {
      console.error("Gemini server error:", error);
      res.json({
        analysis: "Your psychological blueprint reveals deep layers of logical independence and strategic adaptability. You refuse to settle for simplistic binary templates, operating instead with dynamic cognitive resonance.",
        quirkyStat: "You process ethical dilemma answers 93% faster than standard respondents.",
        quote: "Real discovery lies not in seeking new lands, but in seeing with new eyes."
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
