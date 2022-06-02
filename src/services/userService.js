import db from '../models/index'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

var salt = bcrypt.genSaltSync(10);

const getUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = [];
      if (userId === 'all') {
        users = db.User.findAll({
          attributes: {
            exclude: ['password']
          }
        })
      }
      if (userId && userId != 'all') {
        users = db.User.findOne({
          where: { id: userId }
        })
      }
      resolve(users)
    } catch (e) {
      reject(e)
    }
  })
}

const loginUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      const isExist = await checkEmailExist(data.email)
      if (isExist) {
        const user = await db.User.findOne({
          where: { email: data.email },
          attributes: ["email", "username", "password"]
        });
        if (user) {
          const check = await bcrypt.compareSync(
            data.password,
            user.password
          );
          if (check) {
            const token = jwt.sign({email: data.email}, process.env.JWT_KEY)
            
            userData.errCode = 0;
            (userData.errMessage = "OK"), delete user.password;
            userData.user = user;
            userData.token = token;

          } else {
            userData.errCode = 2;
            userData.errMessage = 'Password is wrong. Try again.';
          }
        } else {
          userData.errCode = 1;
          userData.errMessage = `Username or Email is not exist. Please try again.`;
        }
      } else {
        userData.errCode = 1;
        userData.errMessage = `Username or Email is not exist. Please try again.`;
      }
      resolve(userData)
    } catch (e) {
      reject(e)
    }
  })
}

const createUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isExist = await checkEmailExist(data.email);
      if (isExist) {
        resolve({
          errCode: 1,
          errMessage: 'This email is existed. Please try another.'
        })
      } else {
        let hashPasswordBcrypt = await hashPasswordUser(data.password);
        await db.User.create({
          userName: data.userName,
          email: data.email,
          password: hashPasswordBcrypt
        })
        resolve({
          errCode: 0,
          errMessage: 'Create new user completed. Please sign in.'
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

const hashPasswordUser = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      var hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword)
    } catch (e) {
      reject(e)
    }
  })
}

const checkEmailExist = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({
        where: { email: email }
      })
      if (user) {
        resolve(true)
      } else {
        resolve(false)
      }
    } catch (e) {
      reject(e)
    }
  })
}

export default {
  getUsers,
  loginUser,
  createUser
}