const { GoogleGenerativeAI } = require("@google/generative-ai");

const geminiModel = async (prompt) => {
    // console.log(prompt);
    try {
      const gemini_api_key = process.env.GEMINI_API;
      const googleAI = new GoogleGenerativeAI(gemini_api_key);
      const geminiConfig = {
        temperature: 0.9,
        topP: 1,
        topK: 1,
        maxOutputTokens: 4096,
      };
  
      const model = googleAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        geminiConfig,
      });
  
      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error("Error with Gemini:", error);
      throw error;
    }
  };