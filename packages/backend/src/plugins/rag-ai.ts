import { createBackendModule, coreServices } from '@backstage/backend-plugin-api'
import { loggerToWinstonLogger } from '@backstage/backend-common'
import { augmentationIndexerExtensionPoint, retrievalPipelineExtensionPoint, modelExtensionPoint } from '@alithya-oss/backstage-plugin-rag-ai-node';
import { createRoadiePgVectorStore } from '@alithya-oss/backstage-plugin-rag-ai-storage-pgvector'
import { createDefaultRetrievalPipeline } from '@alithya-oss/backstage-plugin-rag-ai-backend-retrieval-augmenter'
import { CatalogClient } from '@backstage/catalog-client'
import { initializeOpenAiEmbeddings } from '@alithya-oss/backstage-plugin-rag-ai-backend-embeddings-openai'
import { ChatOpenAI  } from '@langchain/openai';
// import { OpenAI  } from '@langchain/openai';

// import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

export const ragai= createBackendModule(
    {
      pluginId: 'rag-ai',
      moduleId: 'config',
      register(env) {
        env.registerInit({
          deps: {
            auth: coreServices.auth,
            logger: coreServices.logger,
            database: coreServices.database,
            discovery: coreServices.discovery,
            config: coreServices.rootConfig,
            indexer: augmentationIndexerExtensionPoint,
            pipeline: retrievalPipelineExtensionPoint,
            model: modelExtensionPoint,
          },
          async init({ auth, logger, database, discovery, config, indexer, pipeline, model }) {
            const catalogApi = new CatalogClient({ discoveryApi: discovery });
            const vectorStore = await createRoadiePgVectorStore({
              logger: loggerToWinstonLogger(logger),
              database,
              config,
            });

            indexer.setAugmentationIndexer(await initializeOpenAiEmbeddings({
              auth,
              logger: loggerToWinstonLogger(logger),
              discovery,
              catalogApi,
              vectorStore,
              config,
            }));

            pipeline.setRetrievalPipeline(createDefaultRetrievalPipeline({
              auth,
              logger: loggerToWinstonLogger(logger),
              discovery,
              vectorStore,
            }));

          

            model.setBaseLLM(new ChatOpenAI({
              model: 'gpt-4',
              temperature: 0.9,
              maxTokens: 1000,
              maxRetries: 5, 
              apiKey: config.getString('ai.embeddings.openai.openAIApiKey'),
            }) as any);
          },
        });
      },
    }
  )