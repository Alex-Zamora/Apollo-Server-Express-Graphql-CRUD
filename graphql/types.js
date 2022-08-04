const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = require("graphql");
const { Post, Comment, User } = require("../models");

const UserType = new GraphQLObjectType({
  name: "UserType",
  description: "The user type",
  fields: {
    id: { type: GraphQLID }, // ID
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    displayName: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString }
  }
});

const PostType = new GraphQLObjectType({
  name: "PostType",
  description: "The post type",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    author: { type: UserType, resolve(parent) {
      // console.log("parent ", parent);
      return User.findById(parent.authorId)
    }},
    commnets: {
      type: new GraphQLList(CommnetType),
      resolve(parent) {
        return Comment.find({ postId: parent.id })
      }
    }
  })
});

const CommnetType = new GraphQLObjectType({
  name: "CommnetType",
  description: "The comment type",
  fields: {
    id: { type: GraphQLID },
    comment: { type: GraphQLString },
    user: { type: UserType, resolve(parent) {
      return User.findById(parent.userId);
    }},
    post: { type: PostType, resolve(parent) {
      return Post.findById(parent.postId);
    }}
  }
});

module.exports = {
  UserType,
  PostType,
  CommnetType
}