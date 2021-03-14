const { response } = require('../utils/index');
const unNeedToken = [
  '/login',
  '/register'
]

module.exports = async (ctx, next) => {
  if (unNeedToken.includes(ctx.originalUrl)) {
    await next()
  } else {
    const token = ctx.request.header.token
    const userId = ctx.session[token]
    console.log('22', ctx.cookies.get('@user'))
    if (userId && (ctx.cookies.get('@user') === userId)) {
      await next()
    } else {
      ctx.response.body = response(401, '用户身份过期')
    }
  }
}