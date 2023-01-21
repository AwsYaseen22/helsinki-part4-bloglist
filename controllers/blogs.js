const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async(request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.get('/:id', async(request, response) => {
  const blogs = await Blog.findById(request.params.id)
  response.json(blogs)
})

blogRouter.post('/', async(request, response) => {
  const blog = new Blog(request.body)
  const savedBlog = await blog.save()
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
