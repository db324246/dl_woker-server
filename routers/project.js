const mongo = require('../utils/mongo');
const { response, requiredParams, currentTime } = require('../utils/index');

// 工程项目分页接口
const projectList = async ctx => {
  const { pageNumber, pageSize, name } = ctx.query

  const [ total, list ] = await Promise.all([
    mongo.findTotal('projectMan', name || {}),
    mongo.findPage('projectMan', pageNumber || 1, pageSize || 10, name || {}),
  ])

  ctx.response.body = response(200, '请求成功', {
    total,
    list
  })
}

// 工程项目新增
const addProject = async ctx => {
  const { name, startTime, endTime, workersJson } = ctx.request.body

  const valide = requiredParams(['name', 'startTime', 'endTime'], ctx.request.body)

  if (valide) return ctx.response.body = valide
  let status = 0
  try {
    status = new Date(startTime) < new Date() ? 1 : 0 
    
    const res = await mongo.insertOne('projectMan', {
      name,
      startTime,
      endTime,
      createTime: currentTime(),
      workersJson: workersJson || '',
      status
    })

    ctx.response.body = response(200, '添加成功')
  } catch (error) {
    ctx.response.body = response(400, error)
  }
}

// 工程项目更新
const updateProject = async ctx => {
  const { id, name, startTime, endTime, workersJson } = ctx.request.body

  const valide = requiredParams(['id', 'name', 'startTime', 'endTime'], ctx.request.body)

  if (valide) return ctx.response.body = valide
  let status = 0
  try {
    status = new Date(startTime) < new Date() ? 1 : 0 
    
    const res = await mongo.updateOne('projectMan', {
      name,
      startTime,
      endTime,
      createTime: currentTime(),
      workersJson: workersJson || '',
      status
    }, { _id: mongo.getObjectId(id) })

    ctx.response.body = response(200, '更新成功')
  } catch (error) {
    ctx.response.body = response(400, error)
  }
}

// 工程项目删除
const deleteProject = async ctx => {
  const id = ctx.params.id;

  try {
    const res = await mongo.remove('projectMan', { _id: mongo.getObjectId(id) })

    console.log(111)
    ctx.response.body = response(200, '删除成功')
  } catch (error) {
    ctx.response.body = response(400, error)
  }
}

module.exports = {
  'get /projectList': projectList,
  'post /addProject': addProject,
  'post /updateProject': updateProject,
  'post /deleteProject/:id': deleteProject
}