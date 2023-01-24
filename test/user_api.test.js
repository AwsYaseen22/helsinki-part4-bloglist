const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async() => {
  await User.deleteMany({})
  const saltRounds = 10

  let passwordHash = await bcrypt.hash(helper.initialUsers[0].password, saltRounds)
  let newUser = new User({
    username: helper.initialUsers[0].username,
    name: helper.initialUsers[0].name,
    passwordHash: passwordHash,
  })
  await newUser.save()
  passwordHash = await bcrypt.hash(helper.initialUsers[1].password, saltRounds)
  newUser = new User({
    username: helper.initialUsers[1].username,
    name: helper.initialUsers[1].name,
    passwordHash: passwordHash,
  })
  await newUser.save()


})


describe('Users initials', () => {

  test('Users are returned as json', async() => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns the correct amount of users in the JSON format', async() => {
    const users = await api.get('/api/users')
    expect(users.body).toHaveLength(helper.initialUsers.length)
  })
})

describe('Create new users', () => {

  test('can create a new user', async() => {
    const newUser = {
      'username': 'user3',
      'name': 'user3',
      'password': 'user3',
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const usersAfterAdd = await api.get('/api/users')
    expect(usersAfterAdd.body).toHaveLength(helper.initialUsers.length+1)
  })

  test('if username provided already added it will NOT save the user', async() => {
    const newUser = {
      'username': helper.initialUsers[0].username,
      'name': 'user1',
      'password': 'user1',
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    const users = await api.get('/api/users')
    expect(users.body).toHaveLength(helper.initialUsers.length)
  })

  test('if no username provided it will NOT save the user', async() => {
    const newUser = {
      'username': '',
      'name': 'user3',
      'password': 'user3',
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    const users = await api.get('/api/users')
    expect(users.body).toHaveLength(helper.initialUsers.length)
  })

  test('if no password provided it will NOT save the user', async() => {
    const newUser = {
      'username': 'user3',
      'name': 'user3',
      'password': '',
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    const users = await api.get('/api/users')
    expect(users.body).toHaveLength(helper.initialUsers.length)
  })

})


afterAll(() => {
  mongoose.connection.close()
})

