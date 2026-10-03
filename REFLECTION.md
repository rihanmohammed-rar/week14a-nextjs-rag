# Week 14A – Ship Your Own RAG
## Project Reflection

### What I Built

I built a Retrieval-Augmented Generation (RAG) application using Next.js and the Vercel AI SDK. The application allows users to ask questions about an indexed document corpus and uses a RAG tool to retrieve relevant document chunks before generating an answer.

The application also displays the retrieved sources below the assistant response, allowing the user to see the document information used by the RAG workflow.

### How the RAG Pipeline Works

The application follows a tool-based retrieval workflow:

1. The user submits a question through the chat interface.
2. The language model determines when document retrieval is required.
3. The `getInformation` tool converts the query into an embedding.
4. Upstash Vector is queried to retrieve the most relevant document chunks.
5. Retrieved text and metadata are returned to the model.
6. The model generates an answer using the retrieved information.
7. The retrieved sources are displayed below the answer.

The document corpus is indexed through the project's seed process. The corpus used for this project is a student-created reference companion based on the supplied Artificial Intelligence Regulation Act material.

### What Worked

The most important part of the project was getting the complete RAG flow working end-to-end. I was able to successfully index the document corpus, retrieve relevant information through the RAG tool, generate answers, and display the retrieved sources.

Testing the application with questions about AI regulation produced answers supported by retrieved document chunks, including page and similarity information.

### Challenges

One of the main challenges was configuring the application to work with the OpenAI-compatible API environment provided for the course rather than relying on the default API configuration.

Another challenge was preparing a sufficiently large document corpus for retrieval and ensuring that the application could return relevant chunks from that corpus.

I also had to troubleshoot local development issues involving dependencies, environment variables, API configuration, and the Next.js development server.

### What I Learned

This project helped me understand the difference between a standard LLM application and a RAG application. Instead of relying only on the model's existing knowledge, the RAG workflow provides the model with information retrieved from a controlled document corpus.

I also learned how tool calling can be used to connect a language model to an external vector database and how source metadata can be exposed to users to improve transparency.

### Limitations and Next Steps

The quality of the answers depends on the quality of the indexed corpus, chunking strategy, embeddings, and retrieval results.

For a production implementation, I would further improve chunking and metadata, add stronger evaluation of retrieval quality, expand the test question set, and introduce additional safeguards around document updates and answer grounding.

### Conclusion

The project demonstrates a working end-to-end RAG application with streaming responses, tool-based retrieval, vector search, and visible retrieved sources. It provided practical experience in connecting a Next.js application, language model, embedding workflow, and vector database into a single application.
