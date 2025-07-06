import { logger } from '../utils/logger';

// Ollama API configuration
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3';
const OLLAMA_TEMPERATURE = parseFloat(process.env.OLLAMA_TEMPERATURE || '0.3');

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
  eval_duration?: number;
}

/**
 * Makes a request to the Ollama API
 */
async function ollamaRequest(
  prompt: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    context?: number[];
  } = {}
): Promise<string> {
  const {
    model = OLLAMA_MODEL,
    temperature = OLLAMA_TEMPERATURE,
    maxTokens = 2000,
    context = [],
  } = options;

  try {
    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        temperature,
        max_tokens: maxTokens,
        context,
        stream: false,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ollama API error: ${error}`);
    }

    const data = (await response.json()) as OllamaResponse;
    return data.response;
  } catch (error) {
    logger.error('Ollama API request failed:', error);
    throw error;
  }
}

/**
 * Makes a chat completion request to the Ollama API
 */
async function chatCompletion(
  messages: Array<{ role: string; content: string }>,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<string> {
  // Convert messages to a single prompt for now
  // In a real implementation, you might want to use the /api/chat endpoint
  const prompt = messages
    .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n\n');

  return ollamaRequest(prompt, options);
}

export { ollamaRequest, chatCompletion };
