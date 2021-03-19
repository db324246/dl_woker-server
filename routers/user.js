const mongo = require('../utils/mongo');
const { parse, stringify, response, requiredParams,  queryObj, timeParse, defined, forEach, decrypt } = require('../utils/index');

// 用户分页接口
const userList = async ctx => {
  const { pageNumber, pageSize, username } = ctx.query

  const query = queryObj({
    username
  })

  const [ data, records ] = await Promise.all([
    mongo.findList('user', query),
    mongo.findPage('user', parseInt(pageNumber) || 1, parseInt(pageSize) || 10, query),
  ])
  
  let total = data.length;

  ctx.response.body = response(200, '请求成功', {
    total,
    list: records.map(i => {
      i.createTime = timeParse(i.createTime)
      return i
    }),
  })
}

// 查询当前登陆人
const current = async ctx => {
  const id = ctx.cookies.get('@user_id');
  const token = ctx.cookies.get('@token');

  try {
    const user = await mongo.findOne('user', { _id: mongo.getObjectId(id) })
    
    if (!user) throw '登陆身份已过期'

    ctx.response.body = response(200, '查询成功', {
      token,
      userInfo: user
    })
  } catch (error) {
    ctx.response.body = response(400, error)
  }
}

module.exports = {
  'get /userList': userList,
  'get /current': current
}
