import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  Source,
  GraphQLInt,
  GraphQLList,
} from 'graphql';

export declare type Maybe<T> = null | undefined | T;
export declare type vars = Maybe<{
  readonly [variable: string]: unknown;
}>;

const memberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: {
      type: GraphQLString,
    },
    discount: {
      type: GraphQLInt,
    },
    monthPostsLimit: {
      type: GraphQLInt,
    },
  },
});

const userType = new GraphQLObjectType({
  name: 'UserType',
  fields: {
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
  },
});

const postType = new GraphQLObjectType({
  name: 'PostType',
  fields: {
    title: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
    userId: {
      type: GraphQLString,
    },
  },
});

const profileType = new GraphQLObjectType({
  name: 'ProfileType',
  fields: {
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
  },
});

const schema: GraphQLSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      user: {
        type: GraphQLString,
        args: {
          id: { type: GraphQLString }
        },
        async resolve(_, { id }, ctx) {
          const result = await ctx.db.memberTypes.findOne({
            key: 'id',
            equals: id,
          });
          return JSON.stringify(result);
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