import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { gql } from './gql';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const { query, mutation } = request.body;
      const { variables } = request.body;
      // @ts-ignore
      try {
        return gql(query! || mutation!, variables, fastify);
      } catch (err) {
        return err;
      }
    }
  );
};

export default plugin;
