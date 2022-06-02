import userService from '../services/userService'
import jwt from 'jsonwebtoken'
import db from '../models';

const handleGetUsers = async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: 'Missing requirement parameter',
      users: []
    })
  }

  let users = await userService.getUsers(id)
  return res.status(200).json({
    errCode: 0,
    errMessage: 'OK',
    users
  })
}

const handleCreateUser = async (req, res) => {
  const data = req.body;
  let message = await userService.createUser(data)
  return res.status(200).json(message)
}

const handleLoginUser = async (req, res) => {
  const data = req.body;
  const { token, ...message } = await userService.loginUser(data)

  res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 //1 day
  })

  return res.status(200).json(message)
}

const handleLogoutUser = async (req, res) => {
  res.cookie('jwt', '', { maxAge: 0 })

  res.status(200).json({
    message: 'Logout success'
  })
}

const handleGetToken = async (req, res) => {
  try {
    const cookie = req.cookies['jwt']

    const claims = jwt.verify(cookie, process.env.JWT_KEY)

    if (!claims) {
      return res.status(401).json({
        message: 'Unauthenticated'
      })
    }

    const user = await db.User.findOne({
      where: { email: claims.email },
      attributes: {
        exclude: ['password']
      }
    })

    res.status(200).send(user)
  } catch (e) {
    return res.status(401).json({
      message: 'Unauthenticated'
    })
  }
}

export default {
  handleGetUsers,
  handleCreateUser,
  handleLoginUser,
  handleLogoutUser,
  handleGetToken
}
