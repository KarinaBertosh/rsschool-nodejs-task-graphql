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
    const users = await fastify.db.users.findMany();
    switch (users) {
      case undefined:
        throw fastify.httpErrors.createError(404, 'User not found');
      default:
        return users!;
    }
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });
      switch (user) {
        case undefined:
          throw fastify.httpErrors.createError(404, 'User not found');
        default:
          return user!;
      }
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
      return await fastify.db.users.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      return await fastify.db.users.delete(request.params.id);
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
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });
      switch (user) {
        case undefined:
          throw fastify.httpErrors.createError(400, 'User not subscribed');
        default:
          user!.subscribedToUserIds.push(request.params.id);
          return await fastify.db.users.change(request.body.userId, user!);
      }
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
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });

      switch (
        user &&
        user.subscribedToUserIds.find((item) => item === request.params.id)
      ) {
        case undefined:
          throw fastify.httpErrors.createError(400, 'User not subscribed');
        default: {
          user!.subscribedToUserIds = user!.subscribedToUserIds.filter(
            (i) => i !== request.params.id
          );
          const changedUser = await fastify.db.users.change(
            request.body.userId,
            user!
          );
          return changedUser;
        }
      }
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
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });
      switch (user) {
        case undefined:
          throw fastify.httpErrors.createError(400, 'User not subscribed');
        default:
          return await fastify.db.users.change(request.params.id, request.body);
      }
    }
  );
};

export default plugin;
