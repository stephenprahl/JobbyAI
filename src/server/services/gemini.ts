import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger';

// Gemini API configuration
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const GEMINI_TEMPERATURE = parseFloat(process.env.GEMINI_TEMPERATURE || '0.7');
const GEMINI_MAX_TOKENS = parseInt(process.env.GEMINI_MAX_TOKENS || '2000');

// Initialize Google Generative AI
let genAI: GoogleGenerativeAI | null = null;
let model: GenerativeModel | null = null;

function initializeGemini() {
  if (!GEMINI_API_KEY) {
    logger.warn('Google Gemini API key not provided. AI features may not work properly.');
    return;
  }

  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: {
        temperature: GEMINI_TEMPERATURE,
        maxOutputTokens: GEMINI_MAX_TOKENS,
        topP: 0.9,
        topK: 40,
      },
    });
    logger.info(`Gemini AI initialized with model: ${GEMINI_MODEL}`);
  } catch (error) {
    logger.error('Failed to initialize Gemini AI:', error);
    throw error;
  }
}

// Initialize on module load
initializeGemini();

interface GeminiOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Makes a request to the Gemini API
 */
async function geminiRequest(
  prompt: string,
  options: GeminiOptions = {}
): Promise<string> {
  if (!model) {
    throw new Error('Gemini AI not initialized. Please check your API key configuration.');
  }

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('Empty response from Gemini API');
    }

    return text;
  } catch (error) {
    logger.error('Gemini API request failed:', error);

    // Provide fallback response for critical functionality
    if (error instanceof Error && error.message.includes('SAFETY')) {
      logger.warn('Gemini safety filter triggered, providing fallback response');
      return 'Unable to process this request due to content safety policies. Please try rephrasing your request.';
    }

    throw error;
  }
}

/**
 * Makes a chat completion request to the Gemini API
 */
async function chatCompletion(
  messages: Array<{ role: string; content: string }>,
  options: GeminiOptions = {}
): Promise<string> {
  if (!model) {
    throw new Error('Gemini AI not initialized. Please check your API key configuration.');
  }

  try {
    // Convert messages to Gemini chat format
    const chat = model.startChat({
      history: messages.slice(0, -1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
      generationConfig: {
        temperature: options.temperature || GEMINI_TEMPERATURE,
        maxOutputTokens: options.maxTokens || GEMINI_MAX_TOKENS,
        topP: 0.9,
        topK: 40,
      },
    });

    // Send the last message
    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('Empty response from Gemini API');
    }

    return text;
  } catch (error) {
    logger.error('Gemini chat completion failed:', error);

    // Provide fallback response for critical functionality
    if (error instanceof Error && error.message.includes('SAFETY')) {
      logger.warn('Gemini safety filter triggered, providing fallback response');
      return 'Unable to process this request due to content safety policies. Please try rephrasing your request.';
    }

    throw error;
  }
}

/**
 * Get available models (for future use)
 */
async function getAvailableModels(): Promise<string[]> {
  if (!genAI) {
    return [];
  }

  try {
    const models = await genAI.listModels();
    return models.map(model => model.name);
  } catch (error) {
    logger.error('Failed to get available models:', error);
    return [GEMINI_MODEL]; // Return default model
  }
}

/**
 * Check if Gemini is properly configured
 */
function isGeminiConfigured(): boolean {
  return !!(GEMINI_API_KEY && genAI && model);
}

export {
  chatCompletion, geminiRequest, getAvailableModels, initializeGemini, isGeminiConfigured
};

// For backward compatibility, export the old function names
export { geminiRequest as ollamaRequest };
