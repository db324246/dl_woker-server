const mongo = require('../utils/mongo');
const { response, requiredParams } = require('../utils/index');

// 薪资计算接口
const payList = async ctx => {
  const { projectId } = ctx.query

  const valide = requiredParams(['projectId'], ctx.query)
  if (valide) return ctx.response.body = valide

  try {
    const signInList = await mongo.findList('signIn', { projectId })
    const workers = await mongo.findList('projectWorkers', { projectId })
  
    workers.forEach(w => {
      const wSign = signInList.filter(s => s.workerId === w.workerId)
      w.days = wSign.reduce((prev, cur) => {
        switch (cur.status) {
          case 2:
            prev += 1
            break;
          case 3:
          case 4:
            prev += 0.5
            break;
        }
        return prev
      }, 0)
      w.price = w.pay * w.days
    });

    ctx.response.body = response(200, '查询成功', workers)

    workers.forEach(async w => {
      await mongo.updateOne('projectWorkers', {
        days: w.days,
        price: w.price
      }, {
        workerId: w.workerId,
        projectId
      })
    })
  } catch (error) {
    ctx.response.body = response(400, error)
  }
}

// 结算工资
const payOff = async ctx => {
  const {
    projectId,
    workerId,
    payStatus,
    remaining
  } = ctx.request.body

  const valide = requiredParams(['projectId', 'workerId', 'payStatus'], ctx.request.body)
  if (valide) return ctx.response.body = valide

  if (payStatus === 2 && !remaining) {
    return ctx.response.body = response(400, 'remaining is required when payStatus is 2')
  }

  try {
    const res = await mongo.updateOne('projectWorkers', {
      payStatus: parseInt(payStatus),
      remaining: remaining || 0
    }, {
      projectId,
      workerId,
    })
    
    ctx.response.body = response(200, '操作成功')
  } catch (error) {
    ctx.response.body = response(400, error)
  }
}

module.exports = {
  'get /payList': payList,
  'post /payOff': payOff,
}