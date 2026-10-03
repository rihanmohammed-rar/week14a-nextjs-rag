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
import { Index } from '@upstash/vector';
import { z } from 'zod';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});
const index = new Index();

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
          const { embedding } = await embed({
            model: openai.embedding('text-embedding-3-small'),
            value: query,
          });
          const hits = await index.query({
            vector: embedding,
            topK: 4,
            includeMetadata: true,
          });
          return hits.map((h) => ({
            text: (h.metadata?.text as string) ?? '',
            page: (h.metadata?.page as number) ?? null,
            score: h.score,
          }));
        },
      }),
    },
    maxSteps: 1,
  });

  return result.toDataStreamResponse();
}
