const { GraphQLString, GraphQLID } = require("graphql");
const { User, Post } = require('../models');
const Comment = require("../models/Comment");
const { createJWTToken } = require('../utils/auth');
const { PostType, CommnetType } = require("./types");

const register = {
  type: GraphQLString,
  description: "Register a new user and returns a token",
  args: {
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    displayName: { type: GraphQLString },
  },
  async resolve(_, args) {
    const { username, email, password, displayName } = args;
    
    // const newUser = await User.create({ username, email, password, displayName });
    
    const user = new User({ username, email, password, displayName });
    await user.save();

    const token = createJWTToken({ 
      _id: user._id,
      username: user.username,
      emial: user.email 
    });

    return token;
  }
}

const login = {
  type: GraphQLString,
  description: "Login a user and returns a token",
  args: {
    email: { type: GraphQLString},
    password: { type: GraphQLString },
  },
  async resolve(_, args) {

    const user = await User.findOne({ email: args.email }).select('+password');

    if ( !user || args.password !== user.password )
      throw new Error('Invalid Credentials');

    const token = createJWTToken({ 
      _id: user._id,
      username: user.username,
      emial: user.email 
    });

    return token;
  }
}

const createPost = {
  type: PostType,
  description: "Create a new post",
  args: {
    title: { type: GraphQLString },
    body: { type: GraphQLString },
  },
  async resolve(_, args, { verifiedUser }) {
    const post = new Post( {
      title: args.title,
      body: args.body,
      authorId: verifiedUser._id
    });

    await post.save();

    return post;
  }
};

const updatePost = {
  type: PostType,
  description: "Update a post",
  args: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
  },
  async resolve(_, { id, title, body }, { verifiedUser }) {

    if (!verifiedUser) throw new Error("Unauthorized");

    const updatedPost = await Post.findOneAndUpdate(
      // comparar si es el mismo usario que creo el post y si existe en la db
      { _id: id, authorId: verifiedUser._id },
      {
        title,
        body
      },
      {
        new: true,
        runValidators: true
      }
    )

    return updatedPost;
  }
}

const deletePost = {
  type: GraphQLString,
  description: "Delete a post",
  args: {
    postId: { type: GraphQLID },
  },
  async resolve(_, { postId }, { verifiedUser }) {
    if (!verifiedUser) throw new Error("Unauthorized");

    const postDeleted = await Post.findOneAndDelete({
      _id: postId,
      authorId: verifiedUser._id
    });

    if (!postDeleted) throw new Error("Post not found");

    return "Post deleted"
  }
}

const addComment = {
  type: CommnetType,
  description: "Add a comment to a post",
  args: {
    postId: { type: GraphQLID },
    comment: { type: GraphQLString }
  },
  async resolve(_, { comment, postId }, { verifiedUser }) {
    const newComment = new Comment({
      comment,
      postId,
      userId: verifiedUser._id,
    });
    return await newComment.save();
  }
}

const updateComment = {
  type: CommnetType,
  description: "Update a comment",
  args: {
    id: { type: GraphQLID },
    comment: { type: GraphQLString }
  },
  async resolve(_, { id, comment }, { verifiedUser }) {
    if (!verifiedUser) throw new Error("Unauthorized");

    const updateComment = await Comment.findOneAndUpdate(
      { _id: id, userId: verifiedUser._id },
      {
        comment
      },
      {
        new: true,
        runValidators: true
      }
    )

    if (!updateComment) throw new Error("Comment not found");

    return updateComment;
  }
}

const deletedComment = {
  type: GraphQLString,
  description: "Delete a comment",
  args: {
    commentId: { type: GraphQLID }
  },
  async resolve(_, { commentId }, { verifiedUser }) {
    if (!verifiedUser) throw new Error("Unauthorized");

    const commentDeleted = await Comment.findOneAndDelete({
      _id: commentId,
      userId: verifiedUser._id
    });

    if (!commentDeleted) throw new Error("Comment not found");

    return "Comment deleted";
  }
}

module.exports = {
  register,
  login,
  createPost,
  updatePost,
  deletePost,
  addComment,
  updateComment,
  deletedComment
}