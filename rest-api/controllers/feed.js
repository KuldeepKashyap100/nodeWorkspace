const fs = require('fs');
const path = require('path');

const {validationResult} = require('express-validator');
const Post = require('../model/post');
const User = require('../model/user');
const socket = require('../socket');
const ITEMS_PER_PAGE = 2;

exports.getPosts = async (req, res, next) => {
  const page = req.query.page || 1;
  try {
    // await does not return a promise but a promise like object
    //which have .then we can convert it into a real promise by
    // calling .exec like (Post.find().countDocuments().exec())
    // it does not matter that much but it's a good fact to know
    let totalCount = await Post.find().countDocuments();
    const posts = await Post.find().populate('creator').sort({createdAt: -1}).skip((page-1)*ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);
    res.status(200).json({posts: posts, totalItems: totalCount});
  }
  catch(err) {
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const err = new Error("Validation failed")
        err.status = 422
        throw err;
    }
    if(!req.file) {
      const err = new Error("No image provided");
      err.statusCode = 422;
      throw err;
    }
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imageURL: req.file.path,
      creator: req.userId
    });
    let creator;
    try {
    await post.save();
    let user = await User.findById(req.userId);
    user.posts.push(post);
    await user.save();
    }
    catch(err) {
      next(err);
    }
};

exports.getPost = (req, res, next)=>{
  const postId = req.params.postId;
  Post.findById(postId)
  .then(post=>{
    res.status(200).json({post: post});
  });
};


exports.udpatePost = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
      const err = new Error("Validation failed")
      err.status = 422
      throw err;
  }
  const postId = req.params.postId;
  let imageURL = req.body.image;
  if(req.file) {
    imageURL = req.file.path;
  }
  if(!imageURL) {
    const err = new Error("No file picked.");
    err.statusCode = 422;
    throw err;
  }
  Post.findById(postId)
  .populate('creator')
  .then(post => {
    if(!post) {
      const err =new Error("could not find post");
      err.statusCode = 404;
      throw err;
    }
    if(post.creator._id.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw err;
    }
    if(imageURL!==post.imageURL) clearImage(post.imageURL);
    post.title = req.body.title;
    post.content = req.body.content;
    post.imageURL = imageURL;
    return post.save();
  })
  .then(result=>{
    socket.getIO().emit('posts', { action: 'update', post: result});
    res.status(200).json({message: 'updated result!!!', post: result});
  })
  .catch(err=>{
    next(err);
  });
}

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if(!post) {
      const err =new Error("could not find post");
      err.statusCode = 404;
      throw err;
    }
    if(post.creator.toString() !== req.userId) {
      const err = new Error('Not authorized');
      err.statusCode = 403;
      throw err;
    }
    clearImage(post.imageURL);
    await Post.findByIdAndRemove(req.params.postId);
    const user =  await User.findById(req.userId);
    user.posts.pull(req.params.postId);
    await user.save();
    socket.getIO().emit('posts', {action: 'delete', post: post});
    res.json({message: "deleted successfully", post: post});
  }
  catch(err){next(err)};
}

const clearImage = filePath => {
  fs.unlink(path.join(__dirname, '../',filePath),err=>console.log(err));
};