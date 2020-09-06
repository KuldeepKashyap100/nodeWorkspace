const bcrypt = require("bcrypt");
// actually express-validator builds up on this package
const validator = require("validator");
const jwt = require("jsonwebtoken");

const User = require("../model/user");
const Post = require("..//model/post");
const { clearImage } = require("../util/file");

const ITEMS_PER_PAGE = 2;

module.exports = {
  createUser: async function ({ userInput }, req) {
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: "E-mail address is invalid" });
    }
    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: "Password too short!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input");
      error.code = 422;
      error.data = errors;
      throw error;
    }
    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      const error = new Error("User already exists");
      throw error;
    }
    const hashedPassword = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      email: userInput.email,
      password: hashedPassword,
      name: userInput.name,
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },

  login: async ({ email, password }, req) => {
    const user = await User.findOne({ email: email });
    let err;
    if (!user) {
      err = new Error("Invalid user");
      err.code = 401;
      throw err;
    }
    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      err = new Error("Invalid password");
      err.code = 401;
      throw err;
    }
    const token = jwt.sign(
      { email: email, userId: user._id.toString() },
      "someSecretString",
      { expiresIn: "1h" }
    );

    return { userId: user._id.toString(), token: token };
  },

  createPost: async ({ postInput }, req) => {
    if (req.auth === false) {
      const err = new Error("Not authorized");
      err.code = 401;
      throw err;
    }

    const user = await User.findById(req.userId);

    if (!user) {
      const err = new Error("Not authorized");
      err.code = 401;
      throw err;
    }

    const errors = [];

    if (
      validator.isEmpty(postInput.title) ||
      !validator.isLength(postInput.title, { min: 5 })
    ) {
      errors.push({ message: "Title is invalid." });
    }
    if (
      validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { min: 5 })
    ) {
      errors.push({ message: "Content is invalid." });
    }

    if (errors.length > 0) {
      const err = new Error("Invalid input");
      err.data = errors;
      err.code = 422;
      throw err;
    }

    const post = new Post({
      title: postInput.title,
      content: postInput.content,
      imageURL: postInput.imageURL,
      creator: user,
    });
    const createdPost = await post.save();

    user.posts.push(createdPost);

    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString(),
    };
  },

  loadPosts: async ({page}, req) => {
    if (req.auth === false) {
      const err = new Error("Not authorized");
      err.code = 401;
      throw err;
    }

    if(!page) {
      page = 1;
    }

    const totalPosts = await Post.find().countDocuments();
    const posts = await Post.find().sort({ createdAt: -1 }).skip((page-1)*ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE).populate("creator");

    return {
      posts: posts.map((p) => {
        return {
          ...p._doc,
          _id: p._id.toString(),
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
        };
      }),
      totalPosts: totalPosts
    };
  },
  viewPost: async ({postId}, req) => {
    if (req.auth === false) {
      const err = new Error("Not authorized");
      err.code = 401;
      throw err;
    }
    const post = await Post.findById(postId).populate('creator');
    return {
      ...post._doc,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString() 
    };
  },
  updatePost: async({id, postInput}, req) => {
    if (req.auth === false) {
      const err = new Error("Not authenticated!");
      err.code = 401;
      throw err;
    }

    const post = await Post.findById(id).populate('creator');
    if(!post){
      const err = new Error("No Post found!");
      err.code = 404;
      throw err;
    }
    if(post.creator._id.toString() !== req.userId.toString()) {
      const err = new Error("Not authorized");
      err.code = 403;
      throw err;
    }
    post.title = postInput.title,
    post.content = postInput.content;
    if(postInput.imageURL!=='undefined')
      post.imageURL = postInput.imageURL;
    const updatedPost = await post.save();
    return {
      message: "Updated Successfully",
      ...updatedPost._doc,
      _id: updatedPost._id.toString(),
      createdAt: updatedPost.createdAt.toISOString(),
      updatedAt: updatedPost.updatedAt.toISOString() 
    };
  },
  deletePost: async ({id}, req)=>{
    if (req.auth === false) {
      const err = new Error("Not authenticated!");
      err.code = 401;
      throw err;
    }

    const post = await Post.findById(id).populate('creator');
    if(!post){
      const err = new Error("No Post found!");
      err.code = 404;
      throw err;
    }
    if(post.creator._id.toString() !== req.userId.toString()) {
      const err = new Error("Not authorized");
      err.code = 403;
      throw err;
    }
    const deletePost = await post.deleteOne();
    clearImage(deletePost.imageURL);

    const user = await User.findById(req.userId);
    await user.posts.pull(id);
    return {
      message: "Deleted successfully!!!",
      ...deletePost._doc
    }
  },
  user: async (args, req) => {
    if (req.auth === false) {
      const err = new Error("Not authenticated!");
      err.code = 401;
      throw err;
    }

    const user = await User.findById(req.userId);
    if(!user){
      const err = new Error("No Post found!");
      err.code = 404;
      throw err;
    }
    return {
      ...user._doc,
      _id: user._id.toString()
    };
  },
  updateStatus: async ({status}, req) => {
    if (req.auth === false) {
      const err = new Error("Not authenticated!");
      err.code = 401;
      throw err;
    }

    const user = await User.findById(req.userId);
    if(!user){
      const err = new Error("No Post found!");
      err.code = 404;
      throw err;
    }
    user.status = status;
    await user.save();
    return {
      ...user._doc,
      _id: user._id.toString()
    };
  }
};
