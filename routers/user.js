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
    mongo.findPage('user', pageNumber || 1, pageSize || 10, query),
  ])
  
  let total = data.length;

  ctx.response.body = response(200, '请求成功', {
    total,
    list: records.map(i => {
      i.startTime = timeParse(i.startTime)
      return i
    }),
  })
}

module.exports = {
  'get /userList': userList,
}
