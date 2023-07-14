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
    return await fastify.db.users.findMany();
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
      if (!user) throw fastify.httpErrors.createError(404, 'User not found');

      return user;
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
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });
      const users = await fastify.db.users.findMany();

      if (!user)
        throw fastify.httpErrors.createError(400, 'User not found');

      const profile = await fastify.db.profiles.findOne({
        key: 'userId',
        equals: user.id,
      });

      const posts = await fastify.db.posts.findMany({
        key: 'userId',
        equals: user.id,
      });

      profile && (await fastify.db.profiles.delete(profile.id));

      posts.forEach(async (p: any) => {
        await fastify.db.posts.delete(p.id);
      });

      for (const us of users) {
        const userSub = us.subscribedToUserIds.find((i) => i === user.id);
        if (userSub) {
          us.subscribedToUserIds = us.subscribedToUserIds.filter(
            (i) => i !== user.id
          );
          await fastify.db.users.change(user.id, us);
        }
      }

      return await fastify.db.users.delete(user.id);
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
      if (!user)
        throw fastify.httpErrors.createError(400, 'User not subscribed');

      user!.subscribedToUserIds.push(request.params.id);
      return await fastify.db.users.change(request.body.userId, user!);
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

      if (!user)
        throw fastify.httpErrors.createError(400, 'User not found');
      if (!user.subscribedToUserIds.find((item) => item === request.params.id))
        throw fastify.httpErrors.createError(400, 'User not subscribed');

      user.subscribedToUserIds = user.subscribedToUserIds.filter(
        (i) => i !== request.params.id
      );
      const changedUser = await fastify.db.users.change(
        request.body.userId,
        user
      );
      return changedUser;
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

      if (!user)
        throw fastify.httpErrors.createError(400, 'User not found');

      return await fastify.db.users.change(request.params.id, request.body);
    }
  );
};

export default plugin;
