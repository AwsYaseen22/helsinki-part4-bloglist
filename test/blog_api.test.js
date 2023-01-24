const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const User = require('../models/user')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)



beforeEach(async() => {

  const users = await User.find({})
  // console.log( 'users[0]: ', users[0])
  helper.initialBlogs = helper.initialBlogs.map(b => {
    b.user = users[0]._id
    return b
  })
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
    const token = await api.post('/api/login').send({ 'username': 'user1', 'password': 'user1' })
    const newPost = {
      title: 'added by test post request',
      author: 'unknown',
      url: 'www.unkown.com',
      likes: 10,
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token.body['token']}`)
      .send(newPost)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const blogsAfterAdd = await api.get('/api/blogs')
    expect(blogsAfterAdd.body).toHaveLength(helper.initialBlogs.length+1)
    const contents = blogsAfterAdd.body.map(b => b.title)
    expect(contents).toContain('added by test post request')
  })

  test('if the token is incorrect reject with 401', async() => {
    const token = await api.post('/api/login').send({ 'username': 'user1', 'password': 'user2' })
    console.log(token.body)
    const newPost = {
      title: 'added by test post request',
      author: 'unknown',
      url: 'www.unkown.com',
      likes: 10,
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token.body['token']}`)
      .send(newPost)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    const blogsAfter = await api.get('/api/blogs')
    expect(blogsAfter.body).toHaveLength(helper.initialBlogs.length)
  })

  test('if no likes property in the request, the default is 0', async() => {
    const token = await api.post('/api/login').send({ 'username': 'user1', 'password': 'user1' })
    const newPost = {
      title: 'added by test post request',
      author: 'unknown',
      url: 'www.unkown.com',
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token.body['token']}`)
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
    const token = await api.post('/api/login').send({ 'username': 'user1', 'password': 'user1' })
    const newPost = {
      author: 'unknown',
      likes: 10,
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token.body['token']}`)
      .send(newPost)
      .expect(400)
    const blogsAfterAdd = await api.get('/api/blogs')
    expect(blogsAfterAdd.body).toHaveLength(helper.initialBlogs.length)
  })

})

describe('tests deletion a blog post', () => {
  test('ability to remove specific blog by its id', async() => {
    const token = await api.post('/api/login').send({ 'username': 'user1', 'password': 'user1' })
    const blogs = await api.get('/api/blogs')
    const blogToDelete = blogs.body[0]
    const id = blogToDelete.id
    await api
      .delete(`/api/blogs/${id}`)
      .set('Authorization', `Bearer ${token.body['token']}`)
      .expect(204)

    const blogsAfterDelete = await api.get('/api/blogs')
    expect(blogsAfterDelete.body).toHaveLength(helper.initialBlogs.length-1)
  })
})

describe('tests to update a blog post', () => {
  test('could update the number of likes for a blog post', async() => {
    const token = await api.post('/api/login').send({ 'username': 'user1', 'password': 'user1' })
    const blogs = await api.get('/api/blogs')
    const blogToUpdate = blogs.body[0]
    const blog = {
      likes: 333
    }
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${token.body['token']}`)
      .send(blog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const afterUpdate = await api.get(`/api/blogs/${blogToUpdate.id}`)
    expect(afterUpdate.body.likes).toBe(blog.likes)
  })
})

afterAll(() => {
  mongoose.connection.close()
})

