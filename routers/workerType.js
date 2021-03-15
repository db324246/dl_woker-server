const mongo = require('../utils/mongo');
const { response, requiredParams, decrypt } = require('../utils/index');

// 工种分类列表接口（无分页）
const typeList = async ctx => {
  const list = await mongo.findList('workerType', {
    createUserId: ctx.cookies.get('@user_id')
  })

  ctx.response.body = response(200, '请求成功', list)
}

// 工种分类新增
const addType = async ctx => {
  const { name, pay } = ctx.request.body

  const valide = requiredParams(['name', 'pay'], ctx.request.body)

  if (valide) return ctx.response.body = valide
  try {    
    const res = await mongo.insertOne('workerType', {
      name,
      pay: parseInt(pay),
      createTime: new Date(),
      createUserId: ctx.cookies.get('@user_id'),
      createUsername: decrypt(ctx.cookies.get('@username'))
    })

    ctx.response.body = response(200, '添加成功')
  } catch (error) {
    ctx.response.body = response(400, error)
  }
}

// 工种分类更新
const updateType = async ctx => {
  const { id, name, pay } = ctx.request.body

  const valide = requiredParams(['id', 'name', 'pay'], ctx.request.body)

  if (valide) return ctx.response.body = valide

  try {
    const res = await mongo.updateOne('workerType', {
      name,
      pay: parseInt(pay)
    }, { _id: mongo.getObjectId(id) })

    ctx.response.body = response(200, '更新成功')
  } catch (error) {
    ctx.response.body = response(400, error)
  }
}

// 工种分类删除
const deleteType = async ctx => {
  const id = ctx.params.id;

  try {
    const res = await mongo.remove('workerType', { _id: mongo.getObjectId(id) })

    ctx.response.body = response(200, '删除成功')
  } catch (error) {
    ctx.response.body = response(400, error)
  }
}

module.exports = {
  'get /typeList': typeList,
  'post /addType': addType,
  'post /updateType': updateType,
  'post /deleteType/:id': deleteType
}