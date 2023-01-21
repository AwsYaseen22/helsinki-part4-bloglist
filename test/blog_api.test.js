const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const app = require('../app')
const helper = require('./test_helper')
const { response } = require( '../app' )

const api = supertest(app)

beforeEach(async()=>{
  await Blog.deleteMany({})
  let obj = new Blog(helper.initialBlogs[0])
  await obj.save()
  obj = new Blog(helper.initialBlogs[1])
  await obj.save()
})


describe('tests for blog api', ()=>{
  test('blogs are returned as json', ()=>{
    api
      .get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/)
  })
  test('returns the correct amount of blog posts in the JSON format', ()=>{
    api.get('/api/blogs').then(response=>{
			expect(response.body).toHaveLength(helper.initialBlogs.length)
		})
			
  })
})

afterAll(()=>{
    mongoose.connection.close()
})

