const { response } = require('../utils/index');
const basePath = require('../config/baseUrl.js');
const unNeedTokenApi = [
  '/login',
  '/register'
]

const unNeedTokenUrls = unNeedTokenApi.map(i => basePath + i)

module.exports = async (ctx, next) => {
  if (unNeedTokenUrls.includes(ctx.originalUrl)) {
    await next()
  } else {
    const token = ctx.request.header.token
    const userId = ctx.session[token]

    if (userId && (ctx.cookies.get('@user_id') === userId)) {
      await next()
    } else {
      ctx.response.body = response(401, '用户身份过期')
    }
  }
}