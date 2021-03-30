/**
 * 接口基础路径
 */
basePath = '/dlWokerSever/'

// -------------- 登陆模块 --------------

/**
 * 用户登陆
 */
{
  url: '/login',
  method: 'post',
  data: {
    telephone <string>,  // required
    password <string> // required
  }
}

/**
 * 用户注册
 */
 {
    url: '/register',
    method: 'post',
    data: {
      telephone <string>,  // required
      username <string>, // required
      sex <number>, // required
      password <string> // required
    }
  }

/**
 * 用户登出
 *
 * 需要 token 和 cookie
 */
 {
  url: '/logout/:id',
  method: 'get'
  }

/**
 * 工程项目分页接口
 *
 * 需要 token 和 cookie
 */
{
  url: '/projectList',
  method: 'get',
  params: {
    pageSize <number>,
    pageNumber <number>,
    name <string>,
    status <number>,
    createUserId <string>
  }
}


// -------------- 工程项目模块 --------------

/**
 * 工程项目分页接口
 *
 * 需要 token 和 cookie
 */
{
  url: '/projectList',
  method: 'post',
  data: {
    name <string>,
    pageSize <number>, // required
    pageNumber <number>, // required
    status <number>,
    createUserId <string>
  }
}

/**
 * 工程项目新增接口
 *
 * 需要 token 和 cookie
 */
{
  url: '/addProject',
  method: 'post',
  data: {
    name <string>, // required
    startTime <string>, // required
    endTime <string>, // required
  }
}

/**
 * 工程项目更新接口
 *
 * 需要 token 和 cookie
 */
{
  url: '/updateProject',
  method: 'post',
  data: {
    id <string>, // required
    name <string>, // required
    startTime <string>, // required
    endTime <string>, // required
  }
}

/**
 * 工程项目删除接口
 *
 * 需要 token 和 cookie
 */
{
  url: '/deleteProject/:id',
  method: 'post'
}

/**
 * 工程项目详情信息
 *
 * 需要 token 和 cookie
 */
{
  url: '/projectInfo/:id',
  method: 'get'
}

/**
 * 查询项目下的工人
 *
 * 需要 token 和 cookie
 */
{
  url: '/workersInPro/:projectId',
  method: 'get'
}

/**
 * 批量添加工人
 *
 * 需要 token 和 cookie
 */
{
  url: '/addWorker',
  method: 'post',
  data: {
    projectId <string>, // required
    workersJson [array<object>]: [
      {
        workerId, // required
        workerName, // required
        pay // required
      }
    ]
  }
}

/**
 * 批量移除工人
 *
 * 需要 token 和 cookie
 */
{
  url: '/removeWorker',
  method: 'post',
  data: {
    projectId <string>, // required
    workerIds <string> // required 
  }
}


// -------------- 工种分类模块 --------------

/**
 * 工种分类列表接口（无分页）
 *
 * 需要 token 和 cookie
 */
{
  url: '/typeList',
  method: 'get'
}

/**
 * 工种分类新增接口
 *
 * 需要 token 和 cookie
 */
{
  url: '/addType',
  method: 'post',
  data: {
    name <string>, // required
    pay <number> // required
  }
}

/**
 * 工种分类更新接口
 *
 * 需要 token 和 cookie
 */
{
  url: '/updateType',
  method: 'post',
  data: {
    id <string>, // required
    name <string>, // required
    pay <number> // required
  }
}

/**
 * 工种分类删除接口
 *
 * 需要 token 和 cookie
 */
{
  url: '/deleteType/:id',
  method: 'post'
}


// -------------- 团队模块 --------------

/**
 * 团队列表接口（无分页）
 *
 * 需要 token 和 cookie
 */
 {
  url: '/teamList',
  method: 'get'
}

/**
 * 团队新增
 *
 * 需要 token 和 cookie
 */
{
  url: '/addTeam',
  method: 'post',
  data: {
    name <string>, // required
    memberJson <string> // required
  }
}

/**
 * 团队更新
 *
 * 需要 token 和 cookie
 */
{
  url: '/updateTeam',
  method: 'post',
  data: {
    id <string>, // required
    name <string>, // required
    memberJson <string> // required
  }
}

/**
 * 团队详情信息接口
 *
 * 需要 token 和 cookie
 */
{
  url: '/teamInfo/:id',
  method: 'get'
}


/**
 * 团队删除接口
 *
 * 需要 token 和 cookie
 */
{
  url: '/deleteTeam/:id',
  method: 'post'
}


// -------------- 签到模块 --------------

/**
 * signIn.status: 签到状态
 * 0： 旷工 
 * 1： 休息
 * 2： 全天
 * 4： 上午
 * 5： 下午
 */

/**
 * 一键签到
 *
 * 需要 token 和 cookie
 */
 {
  url: '/signInAll',
  method: 'post',
  data: {
    projectId <string>, // required
    status <number>, // required
  }
}

/**
 * 保存签到
 *
 * 需要 token 和 cookie
 */
 {
  url: '/saveSignIn',
  method: 'post',
  data: {
    projectId <string>, // required
    signInJson <string>, // required
  }
}

/**
 * 补签
 *
 * 需要 token 和 cookie
 */
 {
  url: '/patchSignIn',
  method: 'post',
  data: {
    projectId <string>, // required
    workerId <string>, // required
    workerName <string>, // required
    status <number>, // required
    signInDate <string>, // required
  }
}

/**
 * 签到信息查询
 *
 * 需要 token 和 cookie
 */
 {
  url: '/signInfoByDate',
  method: 'get',
  params: {
    projectId <string>, // required
    status <number>, // required
    signInDate <string>, // required
  }
}


// -------------- 用户模块 --------------

/**
 * 用户分页接口
 *
 * 需要 token 和 cookie
 */
 {
  url: '/userList',
  method: 'get',
  params: {
    username <string>,
    pageNumber <number>,
    pageSize <number>
  }
}

/**
 * 更新用户信息接口
 *
 * 需要 token 和 cookie
 */
 {
  url: '/updateUser',
  method: 'post',
  params: {
    id <string>, // required
    telephone <string>, // required
    username <string>, // required
    sex <number>, // required
    identityId <number>
  }
}

/**
 * 用户项目经历接口
 *
 * 需要 token 和 cookie
 */
 {
  url: '/updateUser',
  method: 'post',
  params: {
    id <string>, // required
    telephone <string>, // required
    username <string>, // required
    sex <number>, // required
    identityId <number>
  }
}

/**
 * 删除用户接口
 *
 * 需要 token 和 cookie 和 超管身份
 */
 {
  url: '/deleteUser/:id',
  method: 'get'
}

/**
 * 查询用户信息
 *
 * 需要 token 和 cookie
 */
 {
  url: '/userInfo/:id',
  method: 'get'
}


// -------------- 结算模块 --------------

/**
 * 薪资计算接口
 *
 * 需要 token 和 cookie
 */
 {
  url: '/payList',
  method: 'get',
  params: {
    projectId <string> // required
  }
}

/**
 * 结算工资
 * 需要 token 和 cookie
 * 
 * projectWorkers.payStatus: 签到状态
 * 0： 未结 
 * 1： 已结清
 * 2： 未结清
 * 
 * 签到状态是 2 时，remaining 必传
 */
 {
  url: '/payOff',
  method: 'post',
  params: {
    projectId <string>, // required
    workerId <string>, // required
    payStatus <number>, // required
    remaining <number>, // 尾款
  }
}