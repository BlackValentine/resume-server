import blogService from '../services/blogService'

const handleGetBlogs = async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: 'Missing requirement parameter',
      blogs: []
    })
  }

  let blogs = await blogService.getBlogs(id)
  return res.status(200).json({
    errCode: 0,
    errMessage: 'OK',
    blogs
  })
}

const handleCreateBlog = async (req, res) => {
  const data = req.body;
  const message = await blogService.createBlog(data)
  return res.status(200).json(message)
}

const handleEditBlog = async (req, res) => {
  const data = req.body;
  const message = await blogService.editUser(data)
  return res.status(200).json(message)
}

export default {
  handleGetBlogs,
  handleCreateBlog,
  handleEditBlog
}