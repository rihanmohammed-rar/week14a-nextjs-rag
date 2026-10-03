# Week 14A – Ship Your Own RAG

A Next.js RAG application built as part of the Week 14 mini-project.

The application allows users to ask questions about an indexed document corpus. Relevant document chunks are retrieved through a RAG tool and supplied to the language model to generate grounded answers. Retrieved sources are displayed below the assistant response.

## Project Overview

This project demonstrates a Retrieval-Augmented Generation (RAG) workflow using:

- Next.js
- Vercel AI SDK
- OpenAI-compatible API endpoint
- Upstash Vector
- Zod
- TypeScript
- Vercel deployment

The application uses a tool-based RAG architecture. When a user asks a substantive question about the indexed documents, the language model can invoke the `getInformation` tool. The tool embeds the query, searches the Upstash Vector index, and returns the most relevant document chunks.

## RAG Architecture

The application follows this flow:

1. User submits a question.
2. The Next.js API route sends the conversation to the language model.
3. The model invokes the `getInformation` RAG tool when document retrieval is needed.
4. The user query is converted into an embedding.
5. Upstash Vector searches the indexed document embeddings.
6. The top relevant chunks are returned with metadata.
7. The language model uses the retrieved information to generate the answer.
8. Retrieved sources are rendered below the assistant response.

## Document Corpus

The indexed corpus is a student-created reference companion based on the supplied Artificial Intelligence Regulation Act material used for this project.

The corpus contains approximately 25 pages of structured reference material covering topics including:

- Objectives of the proposed Act
- AI risk classifications
- Governance and oversight
- National AI governance
- AI registration
- Ethics and sustainability
- Risk-based regulation
- Certification and monitoring
- Public-facing functions
- Audit and inspection
- Emergency shutdown mechanisms
- Employment and labor considerations
- AI applications in key sectors

The corpus is used for RAG retrieval and is not presented as official legislative text or legal advice.

## Key RAG Components

### Chat API

The main RAG implementation is located in:

`app/api/chat/route.ts`

The API uses the Vercel AI SDK `streamText` function and exposes the `getInformation` tool.

### RAG Tool

The `getInformation` tool:

- Accepts the user's search query
- Generates an embedding
- Queries Upstash Vector
- Retrieves the top relevant document chunks
- Returns document text, page metadata, and similarity information

### Source Rendering

Retrieved sources are displayed beneath assistant answers so users can inspect the information used by the RAG workflow.

## Local Setup

### Prerequisites

- Node.js
- npm
- Git
- An OpenAI-compatible API key
- An Upstash Vector index

### Install Dependencies

```bash
npm install --include=optional
