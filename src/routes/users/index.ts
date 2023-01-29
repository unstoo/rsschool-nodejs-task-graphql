import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return fastify.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | {}> {
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id
      });
      if (user) return user;
      reply.statusCode = 404;
      return {};
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = request.body;
      return fastify.db.users.create(user);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | {}> {
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id
      });
      if (!user) {
        reply.statusCode = 400;
        return {};
      }

      await fastify.db.users.delete(request.params.id);
      return user;
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | {}> {
      const addToId = request.body.userId;
      const idToAdd = request.params.id

      const addToUser = await fastify.db.users.findOne({
        key: 'id',
        equals: addToId
      });

      const userToAdd = await fastify.db.users.findOne({
        key: 'id',
        equals: idToAdd,
      });


      if (!addToUser || !userToAdd) {
        reply.statusCode = 400;
        return {};
      }

      const subscribedToUserIds = [...addToUser.subscribedToUserIds, idToAdd];
      const user = {
        ...addToUser,
        subscribedToUserIds
      }
      return await fastify.db.users.change(addToId, user);
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | {}> {
      const removeFromId = request.body.userId;
      const idToRemove = request.params.id

      const removeFromUser = await fastify.db.users.findOne({
        key: 'id',
        equals: removeFromId
      });

      const userToRemove = await fastify.db.users.findOne({
        key: 'id',
        equals: idToRemove,
      });

      if (!removeFromUser || !userToRemove) {
        reply.statusCode = 400;
        return {};
      }

      if (!removeFromUser.subscribedToUserIds.includes(userToRemove.id)) {
        reply.statusCode = 400;
        return {};
      }

      const subscribedToUserIds = removeFromUser.subscribedToUserIds.filter(id => id !== userToRemove.id);
      const user = {
        ...removeFromUser,
        subscribedToUserIds
      }
      return await fastify.db.users.change(request.params.id, user);
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | {}> {
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id
      });
      if (!user) {
        reply.statusCode = 400;
        return {};
      }

      return await fastify.db.users.change(request.params.id, request.body);
    }
  );
};

export default plugin;
