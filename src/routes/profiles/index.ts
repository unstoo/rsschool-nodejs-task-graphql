import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { isUUID } from '../../utils/validators';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    ProfileEntity[]
  > {
    return await fastify.db.profiles.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | {}> {
      const profile = await fastify.db.profiles.findOne({
        key: 'id',
        equals: request.params.id
      });

      if (!profile) {
        reply.statusCode = 404;
        return {};
      }

      return profile;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | {}> {
      const memberTypes = await fastify.db.memberTypes.findOne({
        key: 'id',
        equals: request.body.memberTypeId
      });

      if (!memberTypes) {
        reply.statusCode = 400;
        return {};
      }

      const profiles = await fastify.db.profiles.findMany();

      const exists = profiles.find(profile => profile.userId === request.body.userId);

      if (exists) {
        reply.statusCode = 400;
        return {};
      }

      return await fastify.db.profiles.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | {}> {
      if (!isUUID(request.params.id)) {
        reply.statusCode = 400;
        return {};
      }

      const profile = await fastify.db.profiles.findOne({
        key: 'id',
        equals: request.params.id
      });
      if (!profile) {
        reply.statusCode = 400;
        return {};
      }

      await fastify.db.profiles.delete(request.params.id);
      return profile;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity | {}> {
      console.log(request.params.id)
      if (!isUUID(request.params.id)) {
        reply.statusCode = 400;
        return {};
      }

      const profile = await fastify.db.profiles.findOne({
        key: 'id',
        equals: request.params.id
      });

      if (!profile) {
        reply.statusCode = 400;
        return {};
      }

      return await fastify.db.profiles.change(request.params.id, request.body);
    }
  );
};

export default plugin;
