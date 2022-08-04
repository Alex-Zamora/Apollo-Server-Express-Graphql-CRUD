const { GraphQLList, graphql, GraphQLString, GraphQLID } = require('graphql');
const { User, Comment } = require('../models');
const Post = require('../models/Post');
const { UserType, PostType, CommnetType } = require('./types');

const users = {
  type: new GraphQLList( UserType ),
  description: 'Returns all users',
  // resolve: () => {}
  async resolve() {
    return await User.find();
  }
}

const user = {
  type: UserType,
  description: "Get a user by id",
  args: {
    id: { type: GraphQLID },
  },
  async resolve(_, args) {
    return await User.findById(args.id);
  }
}

const posts = {
  type: new GraphQLList(PostType),
  description: "Get all posts",
  resolve: async () => await Post.find()
};

const post = {
  type: PostType,
  description: "Get post by id",
  args: {
    id: { type: GraphQLID },
  },
  async resolve(_, { id }) {
    return await Post.findById(id)
  }
}

const comments = {
  type: new GraphQLList(CommnetType),
  description: "Get all comments",
  resolve: async () => await Comment.find()
}

const comment = {
  type: CommnetType,
  description: "Get a comment by id",
  args: {
    id: { type: GraphQLID }
  },
  async resolve(_, { id }) {
    return await Comment.findById(id)
  }
}

module.exports = { users, user, posts, post, comments, comment };