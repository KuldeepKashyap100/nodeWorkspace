const express = require('express');
const {body} = require('express-validator');

const router = express.Router();

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

router.get('/posts', isAuth,feedController.getPosts);

router.post('/post', isAuth, [
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5})
],feedController.createPost);

router.get('/post/:postId', isAuth, feedController.getPost);

router.put('/post/:postId', isAuth, feedController.udpatePost);

router.delete('/post/:postId', isAuth, feedController.deletePost)

module.exports = router;