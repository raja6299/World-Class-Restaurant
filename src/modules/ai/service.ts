import { env } from '@/src/config/env';
import { NotConfiguredError, Logger } from '@/src/lib/logger';

export type AIProvider = 'GEMINI' | 'OPENAI' | 'CLAUDE' | 'OPENROUTER';

export interface MenuContextItem {
  name: string;
  price: number;
  description?: string;
  [key: string]: unknown;
}

export interface CartContextItem {
  menuItemId: string;
  quantity: number;
  [key: string]: unknown;
}

export interface AIRequestOptions {
  temperature?: number;
  maxTokens?: number;
}

export class AIService {
  /**
   * Universal provider abstraction for generating AI Waiter responses.
   */
  static async generateWaiterResponse(
    systemPrompt: string, 
    userMessage: string, 
    options?: AIRequestOptions
  ): Promise<string> {
    const provider = env.AI_PROVIDER;
    
    if (!provider) {
      throw new NotConfiguredError('AI_PROVIDER is not configured');
    }

    Logger.debug('Generating AI response', 'AI', { systemPromptLength: systemPrompt.length, userMessageLength: userMessage.length, options });

    try {
      switch (provider) {
        case 'OPENAI':
          return await this.callOpenAI();
        case 'CLAUDE':
          return await this.callClaude();
        case 'OPENROUTER':
          return await this.callOpenRouter();
        case 'GEMINI':
          return await this.callGemini();
        default:
          throw new NotConfiguredError(`Unsupported AI Provider: ${provider}`);
      }
    } catch (error) {
      Logger.error(`Error with AI provider ${provider}`, error, 'AI');
      throw new Error('AI Service temporarily unavailable.');
    }
  }

  // Provider Implementation Stubs
  private static async callGemini(): Promise<string> {
    throw new Error('Provider not implemented: GEMINI');
  }

  private static async callOpenAI(): Promise<string> {
    throw new Error('Provider not implemented: OPENAI');
  }

  private static async callClaude(): Promise<string> {
    throw new Error('Provider not implemented: CLAUDE');
  }

  private static async callOpenRouter(): Promise<string> {
    throw new Error('Provider not implemented: OPENROUTER');
  }

  /**
   * Helper to format Menu and Cart context into a System Prompt
   */
  static buildMenuContextPrompt(menu: MenuContextItem[], cartItems: CartContextItem[], allergies: string[]): string {
    return `
      You are an expert luxury restaurant waiter.
      Current Menu: ${JSON.stringify(menu)}
      Customer Cart: ${JSON.stringify(cartItems)}
      Customer Allergies: ${allergies.join(', ')}

      Always recommend pairings, inform about allergens, and maintain a Michelin-star tone.
    `;
  }
}
