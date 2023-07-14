import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<ProfileEntity[]> {
    return await fastify.db.profiles.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profiles = await fastify.db.profiles.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (!profiles)
        throw fastify.httpErrors.createError(404, 'Profile not found');

      return profiles;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      return await fastify.db.profiles.create(request.body);
      // const type = await fastify.db.memberTypes.findOne({
      //   key: 'id',
      //   equals: request.body.memberTypeId,
      // });
      // if (!type) throw fastify.httpErrors.createError(404, 'Type not found');

      // const profile = await fastify.db.profiles.findOne({
      //   key: 'userId',
      //   equals: request.body.userId,
      // });

      // if (!profile) return await fastify.db.profiles.create(request.body);

      // throw fastify.httpErrors.createError(404, 'Profile already exist');
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (!profile)
        throw fastify.httpErrors.createError(400, 'Profile not found');

      return await fastify.db.profiles.delete(request.params.id);
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
    async function (request, reply): Promise<ProfileEntity> {
      const profiles = await fastify.db.profiles.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (!profiles)
        throw fastify.httpErrors.createError(400, 'Profile not found');

      return await fastify.db.profiles.change(request.params.id, request.body);
    }
  );
};

export default plugin;
