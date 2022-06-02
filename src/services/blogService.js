import db from "../models";

const getBlogs = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let blogs = [];
      if (id === 'all') {
        blogs = await db.Blog.findAll()
      }
      if (id && id !== 'all') {
        blogs = await db.Blog.findOne({
          where: { id }
        })
      }
      resolve(blogs)
    } catch (e) {
      reject(e)
    }
  })
}

const createBlog = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data) {
        resolve({
          errCode: 1,
          errMessage: `Didn't have enough data to create a new blog.`
        })
      } else {
        await db.Blog.create({
          title: data.title,
          subtitle: data.subtitle,
          image: data.image,
          content: data.content,
          rawContent: data.rawContent
        })
        resolve({
          errCode: 0,
          errMessage: 'Congratulate, you have created a new blog.'
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

const editUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if(!data.id) {
        resolve({
          errCode: 2,
          errMessage: 'Missing require parameter!'
        })
      }
      let blog = await db.Blog.findOne({
        where: { id: data.id },
        raw: false
      })
      if (blog) {
        blog.title = data.title;
        blog.subtitle = data.subtitle;
        blog.content = data.content;
        blog.image = data.image;
        blog.rawContent = data.rawContent;
        await blog.save();
        resolve({
          errCode: 0,
          errMessage: 'Updated blog success'
        })
      }
      else {
        resolve({
          errCode: 1,
          errMessage: 'Blog not found'
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

export default {
  getBlogs,
  createBlog,
  editUser
}