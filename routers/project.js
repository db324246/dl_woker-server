const mongo = require('../utils/mongo');
const { parse, stringify, response, requiredParams,  queryObj, timeParse, defined, forEach, decrypt } = require('../utils/index');

const workerAddHandler = async (projectId, worker, ctx) => {
  const hasWorker = await mongo.findOne('projectWorkers', {
    projectId,
    workerId: worker.workerId
  })
  if (hasWorker) {
    ctx.response.body = response(400, '工人已存在项目团队中')
    return 0
  } else {
    await mongo.insertOne('projectWorkers', {
      projectId,
      ...worker
    })
    return 1
  }
}


// 工程项目分页接口
const projectList = async ctx => {
  const { pageNumber, pageSize, name, status, createUserId } = ctx.query

  const query = queryObj({
    name,
    createUserId
  })

  const [ data, records ] = await Promise.all([
    mongo.findList('projectMan', query),
    mongo.findPage('projectMan', pageNumber || 1, pageSize || 10, query),
  ])
  
  const nowDate = new Date();
  let list = records.map(i => {
    i.status = new Date(i.startTime) < nowDate  ? 1 : 0;
    i.startTime = timeParse(i.startTime)
    return i
  })
  let total = data.length;

  if (defined(status)) {
    list = list.filter(i => i.status === parseInt(status))
    total = list.length
  }

  ctx.response.body = response(200, '请求成功', {
    total,
    list,
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
      workersJson: workersJson || '',
      status,
      createTime: new Date(),
      createUserId: ctx.cookies.get('@user_id'),
      createUsername: decrypt(ctx.cookies.get('@username'))
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

    ctx.response.body = response(200, '删除成功')
  } catch (error) {
    ctx.response.body = response(400, error)
  }
}

// 工程项目详情信息
const projectInfo = async ctx => {
  const id = ctx.params.id;

  try {
    const res = await mongo.findOne('projectMan', { _id: mongo.getObjectId(id) })

    ctx.response.body = response(200, '请求成功', res)
  } catch (error) {
    ctx.response.body = response(400, error)
  }
}

// 批量添加工人
const addWorker = async ctx => {
  /**
   * workersJson: array<object> 
   * {
   *  workerId,
   *  workerName,
   *  pay
   * }
   */
  const { projectId, workersJson: _workers } = ctx.request.body

  const valide = requiredParams(['projectId', 'workersJson'], ctx.request.body);
  if (valide) return ctx.response.body = valide

  const workers = parse(_workers);
  const project = await mongo.findOne('projectMan', { _id: mongo.getObjectId(projectId) })
  const workersJson = parse(project.workersJson);

  forEach(workers, w => {
    if (workersJson.some(_w => _w.workerId === w.workerId)) {
      ctx.response.body = response(400, '工人已存在项目团队中')
      return 0
    }
    return 1
  })
  
  workersJson.push(...workers)

  try {
    await mongo.updateOne('projectMan', {
      workersJson: stringify(workersJson)
    }, { _id: mongo.getObjectId(projectId) })
    
    ctx.response.body = response(200, '添加成功')
  } catch (error) {
    ctx.response.body = response(400, error)
  }
}

// 批量移除工人
const removeWorker = async ctx => {
  const { projectId, workerIds: _workerIds } = ctx.request.body

  const valide = requiredParams(['projectId', 'workerIds'], ctx.request.body);
  if (valide) return ctx.response.body = valide

  const workerIds = _workerIds.split(',');
  const project = await mongo.findOne('projectMan', { _id: mongo.getObjectId(projectId) })
  let workersJson = parse(project.workersJson);
  
  forEach(workerIds, id => {
    if (workersJson.every(w => w.workerId !== workerId)) {
      ctx.response.body = response(400, '工人不存在项目团队中')
      return 0
    }
    return 1
  })
  
  workersJson = workersJson.filter(w => !workerIds.includes(w.workerId))

  try {
    await mongo.updateOne('projectMan', {
      workersJson: stringify(workersJson)
    }, { _id: mongo.getObjectId(projectId) })
    
    ctx.response.body = response(200, '移除成功')
  } catch (error) {
    ctx.response.body = response(400, error)
  }
}

module.exports = {
  'get /projectList': projectList,
  'post /addProject': addProject,
  'post /updateProject': updateProject,
  'post /deleteProject/:id': deleteProject,
  'get /project/:id': projectInfo,
  'post /addWorker': addWorker,
  'post /removeWorker': removeWorker,
}
