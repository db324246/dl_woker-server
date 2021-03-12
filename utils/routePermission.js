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
      ctx.response.body = {
        status: 401,
        message: '用户身份过期'
      }
    }
  }
}