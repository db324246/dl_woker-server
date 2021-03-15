const mongo = require('../utils/mongo');
const { parse, response, requiredParams, timeParse, queryObj } = require('../utils/index');

const signInHandler = async obj => {
  const {
    projectId,
    workerName,
    workerId,
    status,
    signInDate: _signInDate
  } = obj
  const signInDate = _signInDate || timeParse('{y}-{m}-{d}');
  // 查询是否已经签到
  const res = await mongo.findOne('signIn', {
    projectId,
    workerId,
    signInDate
  })

  if (res) {
    await mongo.updateOne('signIn', { status: parseInt(status) }, {
      _id: mongo.getObjectId(res.id)
    })
  } else {
    await mongo.insertOne('signIn', {
      projectId,
      workerName,
      workerId,
      status: parseInt(status),
      signInDate,
      createTime: new Date()
    })
  }
}

// 一键签到
const signInAll = async ctx => {
  const { projectId, status } = ctx.request.body

  const valide = requiredParams(['projectId', 'status'], ctx.request.body)

  if (valide) return ctx.response.body = valide

  const project = await mongo.findOne('projectMan', { _id: mongo.getObjectId(projectId) });

  const workers = parse(project.workersJson);

  await Promise.all(
    workers.map(w => {
      return signInHandler({
        projectId,
        workerName: w.workerName,
        workerId: w.workerId,
        status
      })
    })
  )
    .then(res => {
      ctx.response.body = response(200, '签到成功')
    })
    .catch(err => {
      ctx.response.body = response(400, err)
    })
}

// 保存签到
const saveSignIn = async ctx => {
  const { projectId, signInJson } = ctx.request.body
  const valide = requiredParams(['projectId', 'signInJson'], ctx.request.body)
  if (valide) return ctx.response.body = valide

  const signInCon = parse(signInJson);

  await Promise.all(
    signInCon.map(s => {
      return signInHandler({
        projectId,
        workerName: s.workerName,
        workerId: s.workerId,
        status: s.status
      })
    })
  )
    .then(res => {
      ctx.response.body = response(200, '签到成功')
    })
    .catch(err => {
      ctx.response.body = response(400, err)
    })
}

// 补签
const patchSignIn = async ctx => {
  const { projectId, workerId, workerName, status, signInDate } = ctx.request.body
  const valide = requiredParams(['projectId', 'workerId', 'workerName', 'status', 'signInDate'], ctx.request.body)
  if (valide) return ctx.response.body = valide

  try {
    await signInHandler({
      projectId,
      workerName,
      workerId,
      status,
      signInDate
    })
    ctx.response.body = response(200, '签到成功')
  } catch (error) {
    ctx.response.body = response(400, err)
  }
}

// 签到信息查询
const signInfoByDate = async ctx => {
  const { projectId, signInDate, status } = ctx.query;

  const valide = requiredParams(['projectId', 'signInDate'], ctx.query)
  if (valide) return ctx.response.body = valide

  try {
    const res = await mongo.findList('signIn', queryObj({
      projectId,
      signInDate,
      status
    }))
    ctx.response.body = response(200, '请求成功', res)
  } catch (error) {
    ctx.response.body = response(400, err)
  }
}

module.exports = {
  'post /signInAll': signInAll,
  'post /saveSignIn': saveSignIn,
  'post /patchSignIn': patchSignIn,
  'get /signInfoByDate': signInfoByDate
}