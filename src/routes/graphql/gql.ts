import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  Source,
  GraphQLInt,
  GraphQLList,
} from 'graphql';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';
export declare type Maybe<T> = null | undefined | T;
export declare type vars = Maybe<{
  readonly [variable: string]: unknown;
}>;

const memberFields = {
  id: {
    type: GraphQLString,
  },
  discount: {
    type: GraphQLInt,
  },
  monthPostsLimit: {
    type: GraphQLInt,
  },
};
const memberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: memberFields,
});

const userFields = {
  id: {
    type: GraphQLString,
  },
  firstName: {
    type: GraphQLString,
  },
  lastName: {
    type: GraphQLString,
  },
  email: {
    type: GraphQLString,
  },
  subscribedToUserIds: {
    type: new GraphQLList(GraphQLString),
  }
};
const userType = new GraphQLObjectType({
  name: 'UserType',
  fields: userFields,
});

const profileFields = {
  id: {
    type: GraphQLString,
  },
  avatar: {
    type: GraphQLString,
  },
  sex: {
    type: GraphQLString,
  },
  birthday: {
    type: GraphQLInt,
  },
  country: {
    type: GraphQLString,
  },
  street: {
    type: GraphQLString,
  },
  city: {
    type: GraphQLString,
  },
  userId: {
    type: GraphQLString,
  },
  memberTypeId: {
    type: GraphQLString,
  },
};
const profileType = new GraphQLObjectType({
  name: 'ProfileType',
  fields: profileFields,
});

const postFields = {
  id: {
    type: GraphQLString,
  },
  title: {
    type: GraphQLString,
  },
  content: {
    type: GraphQLString,
  },
  userId: {
    type: GraphQLString,
  },
};
const postType = new GraphQLObjectType({
  name: 'PostType',
  fields: postFields,
});

const userFullType = new GraphQLObjectType({
  name: 'UserFull',
  fields: {
    ...userFields,
    profile: {
      type: profileType,
    },
    posts: {
      type: new GraphQLList(postType),
    },
    memberType: {
      type: memberType,
    },
  }
});

const schema: GraphQLSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      userFull: {
        type: userFullType,
        args: {
          id: { type: GraphQLString }
        },
        async resolve(_, { id }, ctx) {
          const user = await ctx.db.users.findOne({ key: 'id', equals: id });
          const profile = user?.id ? await ctx.db.profiles.findOne({ key: 'userId', equals: user.id }) : {};
          const posts = user?.id ? await ctx.db.posts.findMany({ key: 'userId', equals: user.id }) : [];
          const memberType = profile?.memberTypeId ? await ctx.db.memberTypes.findOne({ key: 'id', equals: profile.memberTypeId }) : {};

          return {
            ...user,
            profile,
            memberType,
            posts,
          }
        },
      },
      usersFull: {
        type: new GraphQLList(userFullType),
        async resolve(_, __, ctx) {
          const users = await ctx.db.users.findMany();
          const usersFull = await Promise.all([
            ...users.map(async (user: UserEntity) => {
              const profile = await ctx.db.profiles.findOne({ key: 'userId', equals: user.id }) || {};
              const posts = await ctx.db.posts.findMany({ key: 'userId', equals: user.id }) || [];
              const memberType = profile?.memberTypeId ? await ctx.db.memberTypes.findOne({ key: 'id', equals: profile.memberTypeId }) : {};

              return {
                ...user,
                profile,
                memberType,
                posts,

              }
            })
          ]);
          return usersFull;
        },
      },
      memberType: {
        type: memberType,
        args: {
          id: { type: GraphQLString }
        },
        async resolve(_, { id }, ctx) {
          return await ctx.db.memberTypes.findOne({
            key: 'id',
            equals: id,
          });
        },
      },
      user: {
        type: userType,
        args: {
          id: { type: GraphQLString }
        },
        async resolve(_, { id }, ctx) {
          return await ctx.db.users.findOne({
            key: 'id',
            equals: id,
          });
        },
      },
      profile: {
        type: profileType,
        args: {
          id: { type: GraphQLString }
        },
        async resolve(_, { userId }, ctx) {
          return await ctx.db.profiles.findOne({
            key: 'userId',
            equals: userId,
          });
        },
      },
      post: {
        type: postType,
        args: {
          id: { type: GraphQLString }
        },
        async resolve(_, { id }, ctx) {
          return await ctx.db.posts.findOne({
            key: 'id',
            equals: id,
          });
        },
      },
      users: {
        type: new GraphQLList(userType),
        async resolve(_, __, ctx) {
          return await ctx.db.users.findMany();
        },
      },
      memberTypes: {
        type: new GraphQLList(memberType),
        async resolve(_, __, ctx) {
          return await ctx.db.memberTypes.findMany();
        },
      },
      profiles: {
        type: new GraphQLList(profileType),
        async resolve(_, __, ctx) {
          return await ctx.db.profiles.findMany();
        },
      },
      posts: {
        type: new GraphQLList(postType),
        async resolve(_, __, ctx) {
          return await ctx.db.posts.findMany();
        },
      },
    },
  }),
});

export const gql = async (source: string | Source, variableValues: vars, contextValue: unknown) => {
  return await graphql({ schema, source, variableValues, contextValue });
}