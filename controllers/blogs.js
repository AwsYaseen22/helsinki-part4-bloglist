const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const blogs = await Blog.findById(request.params.id)
  response.json(blogs)
})

// moved to middleware
// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if(authorization && authorization.startsWith('Bearer ')){
//     return authorization.replace('Bearer ', '')
//   }
//   return null
// }

blogRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  // moved to middleware userExtractor
  // const token = request.token
  // const tokenDetails = jwt.verify(token, process.env.SECRET)
  // if(!tokenDetails.id){
  //   return response.status(401).json({ error: 'token invalid' })
  // }
  // const user1 = await User.findById(tokenDetails.id)
  const user = request.user
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  }

  const newBlog = new Blog(blog)
  const savedBlog = await newBlog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', userExtractor, async (request, response) => {
  const id = request.params.id
  const blog = await Blog.findById(id)
  const userId = request.user._id.toString()
  if (blog.user.toString() === userId) {
    await Blog.findByIdAndRemove(id)
    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'unauthorized person' })
  }
})

blogRouter.put('/:id', userExtractor, async (request, response) => {
  const id = request.params.id
  // const { likes } = request.body
  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    request.body,
    { new: true }
  )
  response.json(updatedBlog)
})

module.exports = blogRouter
