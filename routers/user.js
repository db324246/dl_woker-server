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
    
    if (!user) throw '用户不存在'

    ctx.response.body = response(200, '查询成功', {
      token,
      userInfo: user
    })
  } catch (error) {
    ctx.response.body = response(400, error)
  }
}

// 更新用户信息
const updateUser = async ctx => {
  const {
    id,
    telephone,
    username,
    sex,
    identityId } = ctx.request.body;
  
  const valide = requiredParams(['id', 'telephone', 'username', 'sex'], ctx.request.body)
  if (valide) return ctx.response.body = valide

  try {
    const user = await mongo.findOne('user', { _id: mongo.getObjectId(id) })
    
    if (!user) throw '用户不存在'

    await mongo.updateOne('user', {
      telephone,
      username,
      sex,
      identityId: identityId || user.identityId
    },{ _id: mongo.getObjectId(id) })

    ctx.response.body = response(200, '更新成功')
  } catch (error) {
    ctx.response.body = response(400, error)
  }
}

// 删除用户
const deleteUser = async ctx => {
  const identityId = ctx.cookies.get('@user_identityId')
  if (identityId > 0) {
    ctx.response.body = response(400, '操作权限等级不够')
  }
  const id = ctx.params.id

  try {
    await mongo.remove('user', { _id: mongo.getObjectId(id) })
    
    ctx.response.body = response(200, '删除成功')
  } catch (error) {
    ctx.response.body = response(400, error)
  }
}

// 查询用户信息
const userInfo = async ctx => {
  const id = ctx.params.id

  try {
    const user = await mongo.findOne('user', { _id: mongo.getObjectId(id) })
    
    if (!user) throw '用户不存在'

    ctx.response.body = response(200, '查询成功', user)
  } catch (error) {
    ctx.response.body = response(400, error)
  }
}

module.exports = {
  'get /userList': userList,
  'get /current': current,
  'post /updateUser': updateUser,
  'get /deleteUser/:id': deleteUser,
  'get /userInfo/:id': userInfo
}
