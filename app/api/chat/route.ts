/**
 * Final Route Handler — Step 4 of Section 4 (RAG-as-tool-call) +
 * the source metadata used by Step 5's UI.
 *
 * The model decides whether to call the getInformation tool. When it does,
 * the tool runs vector search and returns chunk text + page + score. The
 * client renders those as collapsible sources under the assistant message.
 */
import { createOpenAI } from '@ai-sdk/openai';
import { streamText, tool, embed, convertToCoreMessages } from 'ai';
import { z } from 'zod';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});


export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system:
  'You are a helpful assistant that answers questions using the indexed document corpus. ' +
  'Use the getInformation tool whenever the user asks a question that could be answered ' +
  'from the indexed documents. Base your answer on the retrieved information. ' +
  'If the indexed documents do not contain enough information to answer the question, ' +
  'say so directly rather than guessing.',
    messages: convertToCoreMessages(messages),
    tools: {
      getInformation: tool({
        description:
  'Search the indexed document corpus for information relevant to the user question. Use this whenever the user asks a substantive question that may be answered by the documents.',
        parameters: z.object({
          query: z
            .string()
            .describe('the topic, term, or sub-question to search for'),
        }),
        execute: async ({ query }) => {
          console.log('[RAG] Tool started:', query);

          try {
            const { embedding } = await embed({
              model: openai.embedding('text-embedding-3-small'),
              value: query,
            });

            console.log('[RAG] Embedding completed:', embedding.length);

            const upstashUrl = process.env.UPSTASH_VECTOR_REST_URL;
            const upstashToken = process.env.UPSTASH_VECTOR_REST_TOKEN;

            if (!upstashUrl || !upstashToken) {
              throw new Error(
                'Upstash Vector environment variables are not configured.'
              );
            }

            const response = await fetch(`${upstashUrl}/query`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${upstashToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                vector: embedding,
                topK: 4,
                includeMetadata: true,
              }),
            });

            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(
                `Upstash Vector query failed (${response.status}): ${errorText}`
              );
            }

            const data = await response.json();
            const hits = data.result ?? [];

            console.log('[RAG] Vector query completed:', hits.length);

            return hits.map((h: any) => ({
              text: h.metadata?.text ?? '',
              page: h.metadata?.page ?? null,
              score: h.score,
            }));
          } catch (error) {
            console.error('[RAG TOOL ERROR]', error);
            throw error;
          }
        },
      }),
    },
    maxSteps: 3,
  });

  return result.toDataStreamResponse();
}
