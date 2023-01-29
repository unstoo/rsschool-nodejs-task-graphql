import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
// import { idParamSchema } from '../../utils/reusedSchemas';
// import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<MemberTypeEntity[]> {
    return fastify.db.memberTypes.findMany();
  });

  // fastify.get(
  //   '/:id',
  //   {
  //     schema: {
  //       params: idParamSchema,
  //     },
  //   },
  //   async function (request, reply): Promise<MemberTypeEntity> {
  //     const memberTypes = fastify.db.memberTypes.findOne({ key: 'id', equals: request.params.id });
  //   }
  // );

  // fastify.patch(
  //   '/:id',
  //   {
  //     schema: {
  //       body: changeMemberTypeBodySchema,
  //       params: idParamSchema,
  //     },
  //   },
  //   async function (request, reply): Promise<MemberTypeEntity> {}
  // );
};

export default plugin;
