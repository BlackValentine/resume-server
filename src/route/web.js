import express from 'express';
import userController from '../controllers/userController'
import blogController from '../controllers/blogController'

let router = express.Router();

let initWebRoutes = (app) => {
  router.get('/api/user/get-users', userController.handleGetUsers)

  router.post('/api/user/create-user', userController.handleCreateUser)

  router.post('/api/user/login-user', userController.handleLoginUser)

  router.post('/api/user/logout-user', userController.handleLogoutUser)

  router.get ('/api/user/get-token', userController.handleGetToken)

  router.get('/api/blog/get-blogs', blogController.handleGetBlogs)

  router.post('/api/blog/create-blog', blogController.handleCreateBlog)

  router.put('/api/blog/edit-blog', blogController.handleEditBlog)

  return app.use('/', router);
}

export default initWebRoutes;