const mongo = require('../utils/mongo');
const { parse, timeParse, response, requiredParams, decrypt } = require('../utils/index');

// 团队列表接口（无分页）
const teamList = async ctx => {
  const createUserId = ctx.cookies.get('@user_id')

  try {
    const list = await mongo.findList('team', { createUserId })
  
    ctx.response.body = response(
      200,
      '请求成功',
      list.map(i => {
        i.createTime = timeParse(i.createTime)
        return i
      })
    )
  } catch (error) {
    ctx.response.body = response(400, error)
  }
}

// 团队详情信息
const teamInfo = async ctx => {
  const id = ctx.params.id
  const createUserId = ctx.cookies.get('@user_id')
  try {
    const team = await mongo.findOne('team', {
      createUserId,
      _id: mongo.getObjectId(id)
    })

    ctx.response.body = response(200, '查询成功', team)
  } catch (error) {
    ctx.response.body = response(400, error)
  }
}

// 团队新增
const addTeam = async ctx => {
  const { name, memberJson } = ctx.request.body

  const valide = requiredParams(['name', 'memberJson'], ctx.request.body)

  if (valide) return ctx.response.body = valide
  try {    
    const res = await mongo.insertOne('team', {
      name,
      memberJson,
      createTime: new Date(),
      createUserId: ctx.cookies.get('@user_id'),
      createUsername: decrypt(ctx.cookies.get('@username'))
    })

    ctx.response.body = response(200, '添加成功')
  } catch (error) {
    ctx.response.body = response(400, error)
  }
}

// 团队更新
const updateTeam = async ctx => {
  const { id, name, memberJson } = ctx.request.body

  const valide = requiredParams(['id', 'name', 'memberJson'], ctx.request.body)

  if (valide) return ctx.response.body = valide

  try {
    const res = await mongo.updateOne('team', {
      name,
      memberJson
    }, { _id: mongo.getObjectId(id) })

    ctx.response.body = response(200, '更新成功')
  } catch (error) {
    ctx.response.body = response(400, error)
  }
}

// 团队删除
const deleteTeam = async ctx => {
  const id = ctx.params.id;

  try {
    const res = await mongo.remove('team', { _id: mongo.getObjectId(id) })

    ctx.response.body = response(200, '删除成功')
  } catch (error) {
    ctx.response.body = response(400, error)
  }
}

module.exports = {
  'get /teamList': teamList,
  'get /teamInfo/:id': teamInfo,
  'post /addTeam': addTeam,
  'post /updateTeam': updateTeam,
  'post /deleteTeam/:id': deleteTeam
}