const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async() => {
  await Blog.deleteMany({})
  let obj = new Blog(helper.initialBlogs[0])
  await obj.save()
  obj = new Blog(helper.initialBlogs[1])
  await obj.save()
})


describe('tests initials', () => {

  test('blogs are returned as json', async() => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns the correct amount of blog posts in the JSON format', async() => {
    const blogs = await api.get('/api/blogs')
    expect(blogs.body).toHaveLength(helper.initialBlogs.length)
  })

  test('the unique identifier property of the blog posts is named id', async() => {
    const blogs = await api.get('/api/blogs')
    expect(blogs.body[0].id).toBeDefined()
  })
})

describe('tests for add new blog posts', () => {

  test('can creates a new blog post', async() => {
    const newPost = {
      title: 'added by test post request',
      author: 'unknown',
      url: 'www.unkown.com',
      likes: 10,
    }
    await api
      .post('/api/blogs')
      .send(newPost)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const blogsAfterAdd = await api.get('/api/blogs')
    expect(blogsAfterAdd.body).toHaveLength(helper.initialBlogs.length+1)
    const contents = blogsAfterAdd.body.map(b => b.title)
    expect(contents).toContain('added by test post request')
  })

  test('if no likes property in the request, the default is 0', async() => {
    const newPost = {
      title: 'added by test post request',
      author: 'unknown',
      url: 'www.unkown.com',
    }
    await api
      .post('/api/blogs')
      .send(newPost)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const blogsAfterAdd = await api.get('/api/blogs')
    expect(blogsAfterAdd.body).toHaveLength(helper.initialBlogs.length+1)
    const likes = blogsAfterAdd.body.map(b => b.likes)
    expect(blogsAfterAdd.body[blogsAfterAdd.body.length-1].likes).toBeDefined()
    expect(likes[likes.length-1]).toBe(0)
  })

  test('if title or url missed, the responds will be with status code 400', async() => {
    const newPost = {
      author: 'unknown',
      likes: 10,
    }
    await api
      .post('/api/blogs')
      .send(newPost)
      .expect(400)
    const blogsAfterAdd = await api.get('/api/blogs')
    expect(blogsAfterAdd.body).toHaveLength(helper.initialBlogs.length)
  })

})

describe('tests deletion a blog post', () => {
  test('ability to remove specific blog by its id', async() => {
    const blogs = await api.get('/api/blogs')
    const blogToDelete = blogs.body[0]
    const id = blogToDelete.id
    await api
      .delete(`/api/blogs/${id}`)
      .expect(204)

    const blogsAfterDelete = await api.get('/api/blogs')
    expect(blogsAfterDelete.body).toHaveLength(helper.initialBlogs.length-1)
  })
})

afterAll(() => {
  mongoose.connection.close()
})

