
import { GoogleGenAI } from "@google/genai";
import type { AspectRatio } from "../pages/user/ImageGenerationPage";

// Assume API_KEY is set in the environment
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // For this project, we'll proceed, but API calls will fail without a key.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateImage = async (
  prompt: string,
  aspectRatio: AspectRatio
): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("No image was generated.");
    }
  } catch (error) {
    console.error("Error generating image with Gemini API:", error);
    // In a real app, you'd want to check the error type and message
    // to provide more specific feedback to the user.
    if (error instanceof Error && error.message.includes("API key not valid")) {
       throw new Error("The API key is invalid. Please check your configuration.");
    }
    throw new Error("Failed to generate image. The API may be unavailable or the prompt was rejected.");
  }
};
