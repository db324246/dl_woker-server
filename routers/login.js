const mongo = require('../utils/mongo');
const { stringify } = require('../utils/index');

//cookie配置
const cookieConfig = (maxAge, signed) => {
  return {
    domain: 'localhost',  // 写cookie所在的域名
    path: '/',       // 写cookie所在的路径
    maxAge, // cookie有效时长
    signed,
   // expires: new Date('2017-02-15'),  // cookie失效时间
    httpOnly: false,  // 是否只用于http请求中获取
    overwrite: false  // 是否允许重写
  }
}

// 登陆
const login = async ctx => {
  const {
    telephone,
    password } = ctx.request.body;

  const res = await mongo.findOne('user', { telephone })
  if (!res) {
    ctx.response.body = {
      status: 400,
      message: '用户不存在'
    }
    return
  }
  const user = await mongo.findOne('user', { telephone, password })

  if (!user || (user.password !== password)) {
    ctx.response.body = {
      status: 400,
      message: '密码错误'
    }
    return
  }

  //设置session
  const token = '8888888888888888888'
  ctx.session[token] = user._id

  console.log('储存token', user)
  console.log('储存token', ctx.session)
  console.log('储存token', ctx.session[token])
  //设置cookie
  ctx.cookies.set(
    '@user', //value(可替换为token)
    user._id, //name
    cookieConfig(1800000, true)
  );
  ctx.cookies.set(
    '@token', //name
    token, //value(可替换为token)
    cookieConfig(1800000, true)
  );

  ctx.response.body = {
    token,
    userInfo: user
  }
}

// 登出
const logout = async ctx => {
  console.log(222, ctx)
  const userId = ctx.params.id

  const res = await mongo.findOne('user', { _id: userId })
  if (!res) {
    ctx.response.body = {
      status: 400,
      message: '用户不存在'
    }
    return
  }

  // 清除cookie 和 session
  ctx.session[user.id] = null
  ctx.cookies.set(
    '@user',//name
    '', //value(可替换为token)
    cookieConfig(0, false)
  );
  ctx.cookies.set(
    '@token',//name
    '', //value(可替换为token)
    cookieConfig(0, false)
  );
  ctx.response.body = {
    status: 200,
    message: '登出成功'
  }
}

// 注册
const register = async ctx => {
  const {
    telephone,
    username,
    sex,
    password } = ctx.request.body;

  const res = await mongo.findOne('user', { telephone })
  if (res) {
    ctx.response.body = {
      status: 400,
      message: '用户已存在'
    }
    return
  }

  const user = {
    sex: sex || 1,
    telephone,
    username,
    password,
    identityId: 3 // 3：工人 默认是工人
  }
  const res2 = await mongo.insertOne('user', user)

  ctx.response.body = {
    status: 200,
    message: '注册成功'
  }
}

module.exports = {
  'post /login': login,
  'post /register': register,
  'get /logout/:id': logout
}