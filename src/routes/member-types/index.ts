import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    MemberTypeEntity[]
  > {
    return await fastify.db.memberTypes.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const types = await fastify.db.memberTypes.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (types) {
        return types;
      } else {
        throw fastify.httpErrors.createError(404, 'User not found');
      }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const types = await fastify.db.memberTypes.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (types) {
        return await fastify.db.memberTypes.change(
          request.params.id,
          request.body
        );
      } else {
        throw fastify.httpErrors.createError(400, 'User not subscribed');
      }
    }
  );
};

export default plugin;
