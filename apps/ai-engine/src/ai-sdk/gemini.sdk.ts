import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const ai = new GoogleGenAI({
    apiKey: "AIzaSyAz_7aRbjOFS2UukJprJjtrvIBgxQo-AMM",
});

export async function callAI({ prompt }: { prompt: string }) {
    // const groundingTool = {
    //     googleSearch: {},
    // };

    // const config = {
    //     tools: [groundingTool],
    // };
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
    });
    return JSON.parse(response.text ?? "{}");
}
// callAI({ prompt: "what is this website about http://gladcode.in/" }).then(console.log).catch(console.error);