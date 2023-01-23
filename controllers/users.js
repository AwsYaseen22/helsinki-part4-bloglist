const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const user = await User.findOne({ username })
  // both username and password must be given
  if(!username || !password){
    return response.status(400).json({
      error: 'username and password must be given'
    })
  }
  // user unique
  if (user) {
    return response.status(400).json({
      error: 'username must be unique'
    })
  }
  // length must be 3 or above
  if(username.length < 3 || password.length < 3){
    return response.status(400).json({
      error: 'username and password must be greater than or equal to 3'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const newUser = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await newUser.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

module.exports = usersRouter