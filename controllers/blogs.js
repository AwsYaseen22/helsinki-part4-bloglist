const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require( '../models/user' )

blogRouter.get('/', async(request, response) => {
  const blogs = await Blog.find({}).populate('user', { username:1, name:1 })
  response.json(blogs)
})

blogRouter.get('/:id', async(request, response) => {
  const blogs = await Blog.findById(request.params.id)
  response.json(blogs)
})

blogRouter.post('/', async(request, response) => {
  const users  = await User.find({})
  const user1 = users[0]
  const body = request.body
  const blog = {
    'title': body.title,
    'author': body.author,
    'url': body.url,
    'likes': body.likes,
    'user': user1._id
  }

  const newBlog = new Blog(blog)
  const savedBlog = await newBlog.save()
  user1.blogs = user1.blogs.concat(savedBlog._id)
  await user1.save()
  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async(request, response) => {
  const id = request.params.id
  await Blog.findByIdAndRemove(id)
  response.status(204).end()
})

blogRouter.put('/:id', async(request, response) => {
  const id = request.params.id
  const { likes } = request.body
  const updatedBlog = await Blog.findByIdAndUpdate(id, { likes }, { new: true })
  response.json(updatedBlog)
})

module.exports = blogRouter
