const mongo = require('../utils/mongo');
const { parse, stringify, response, requiredParams,  queryObj, timeParse, defined, forEach, decrypt, tryCatch } = require('../utils/index');

const workerAddHandler = async (projectId, worker, project) => {
  const hasWorker = await mongo.findOne('projectWorkers', {
    projectId,
    workerId: worker.workerId
  })
  if (!hasWorker) {
    await mongo.insertOne('projectWorkers', {
      projectId,
      ...worker,
      projectName: project.name,
      projectStatus: project.status,
      days: 0,
      price: 0,
      payStatus: 0,
      remaining: 0
    })
    // 添加工人时，修改工人的状态
    await mongo.updateOne('user', {
      status: 1
    }, {
      _id: mongo.getObjectId(worker.workerId)
    })
    return 1
  }
}

const workerDelHandler = async (projectId, workerId) => {
  const hasWorker = await mongo.findOne('projectWorkers', {
    projectId,
    workerId
  })
  if (hasWorker) {
    await mongo.remove('projectWorkers', {
      projectId,
      workerId
    })
    // 移除工人时，修改工人的状态
    await mongo.updateOne('user', {
      status: 0
    }, {
      _id: mongo.getObjectId(worker.workerId)
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

  query.name && (query.name = {$regex: new RegExp(query.name, 'i')})
  const [ data, records ] = await Promise.all([
    mongo.findList('projectMan', query),
    mongo.findPage('projectMan', pageNumber || 1, pageSize || 10, query),
  ])
  
  const nowDate = new Date();
  let list = records.map(i => {
    i.status = new Date(i.startTime) < nowDate  ? 1 : 0;
    i.createTime = timeParse(i.createTime)
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
  const { name, startTime, endTime } = ctx.request.body

  const valide = requiredParams(['name', 'startTime', 'endTime'], ctx.request.body)

  if (valide) return ctx.response.body = valide
  let status = 0
  try {
    status = new Date(startTime) < new Date() ? 1 : 0 
    
    const res = await mongo.insertOne('projectMan', {
      name,
      startTime,
      endTime,
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
  const { id, name, startTime, endTime } = ctx.request.body

  const valide = requiredParams(['id', 'name', 'startTime', 'endTime'], ctx.request.body)

  if (valide) return ctx.response.body = valide
  let status = 0
  try {
    status = new Date(startTime) < new Date() ? 1 : 0 
    
    const res = await mongo.updateOne('projectMan', {
      name,
      startTime,
      endTime,
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
    const nowDate = new Date();
    const res = await mongo.findOne('projectMan', { _id: mongo.getObjectId(id) })
    res.status = new Date(res.startTime) < nowDate  ? 1 : 0;

    ctx.response.body = response(200, '请求成功', res)
  } catch (error) {
    ctx.response.body = response(400, error)
  }
}

// 查询项目下的工人
const workersInPro = async ctx => {
  const { projectId } = ctx.params

  try {
    const res = await mongo.findList('projectWorkers', { projectId })
    
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

  try {
    const workers = parse(_workers);

    const nowDate = new Date();
    const project = await mongo.findOne('projectMan', { _id: mongo.getObjectId(projectId) })
    project.status = new Date(project.startTime) < nowDate  ? 1 : 0;
    
    forEach(workers, async w => {
      const res = await workerAddHandler(projectId, w, project)
      return res
    })
    
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

  try {
    const workerIds = _workerIds.split(',');
  
    forEach(workerIds, async (id) => {
      const res = await workerDelHandler(projectId, id)
      return res
    })
    
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
  'get /projectInfo/:id': projectInfo,
  'post /addWorker': addWorker,
  'post /removeWorker': removeWorker,
  'get /workersInPro/:projectId': workersInPro
}
