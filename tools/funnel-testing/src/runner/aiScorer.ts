import OpenAI from 'openai';
import { Gateway, Persona } from '../shared/schemas';
import { promises as fs } from 'fs';

export interface AIScoreResult {
  intent_match: number;
  trust: number;
  friction: number;
  clarity: number;
  mobile_usability: number;
  conversion_confidence: number;
  reasoning: string;
  recommendations: string[];
}

export class AIScorer {
  private openai: OpenAI | null = null;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  async scorePageFromScreenshot(
    screenshotPath: string,
    gateway: Gateway,
    persona: Persona,
    pageTitle: string,
    pageUrl: string
  ): Promise<AIScoreResult> {
    if (!this.openai) {
      // Fallback to heuristic scoring
      return this.heuristicScore(gateway, persona, pageTitle);
    }

    try {
      const imageBuffer = await fs.readFile(screenshotPath);
      const base64Image = imageBuffer.toString('base64');

      const prompt = `You are a UX conversion expert analyzing a landing page for a Swiss moving company.

**Gateway Context:**
- Intent: ${gateway.intent || 'General moving inquiry'}
- Language: ${gateway.language}
- Name: ${gateway.name}

**User Persona:**
- Name: ${persona.name}
- Traits: ${persona.traits.join(', ')}
- Budget: ${persona.budget}
- Urgency: ${persona.urgency}
- Trust Level: ${persona.trust_level}
- Device: ${persona.device}

**Page Details:**
- Title: ${pageTitle}
- URL: ${pageUrl}

**Task:** Evaluate this page on a scale of 1-5 for:
1. **intent_match**: Does the page content match the user's search intent?
2. **trust**: Trust signals (certifications, reviews, security indicators)
3. **friction**: How many steps/obstacles before conversion? (1=high friction, 5=smooth)
4. **clarity**: Is the value proposition and CTA clear?
5. **mobile_usability**: Layout, readability, touch targets (if mobile)
6. **conversion_confidence**: Overall likelihood this persona would convert (1-100%)

Respond in JSON format:
{
  "intent_match": <number>,
  "trust": <number>,
  "friction": <number>,
  "clarity": <number>,
  "mobile_usability": <number>,
  "conversion_confidence": <number>,
  "reasoning": "<brief explanation>",
  "recommendations": ["<improvement 1>", "<improvement 2>", ...]
}`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
      });

      const content = response.choices[0].message.content || '{}';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      throw new Error('Failed to parse AI response');
    } catch (error) {
      console.error('AI scoring failed, using fallback:', error);
      return this.heuristicScore(gateway, persona, pageTitle);
    }
  }

  private heuristicScore(
    gateway: Gateway,
    persona: Persona,
    pageTitle: string
  ): AIScoreResult {
    // Fallback heuristic scoring
    let intentMatch = 3;
    if (gateway.intent && pageTitle.toLowerCase().includes(gateway.intent.toLowerCase())) {
      intentMatch = 5;
    }

    let trust = 3;
    if (persona.trust_level === 'high') trust = 4;
    if (persona.trust_level === 'low') trust = 2;

    let friction = 3;
    if (persona.urgency === 'high') friction = 2; // High urgency = notices friction more

    const clarity = 3;
    const mobileUsability = persona.device === 'mobile' ? 3 : 5;
    const conversionConfidence = Math.round((intentMatch + trust + friction + clarity) * 5);

    return {
      intent_match: intentMatch,
      trust,
      friction,
      clarity,
      mobile_usability: mobileUsability,
      conversion_confidence: Math.min(100, conversionConfidence),
      reasoning: 'Heuristic scoring (no OpenAI API key provided)',
      recommendations: [
        'Set OPENAI_API_KEY for AI-powered scoring',
        'Add more trust signals',
        'Simplify the conversion funnel',
      ],
    };
  }
}
