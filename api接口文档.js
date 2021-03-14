/**
 * 用户登陆
 */
{
  url: '/login',
  method: 'post',
  data: {
    telephone,  // required
    password  // required
  }
}

/**
 * 用户注册
 */
 {
    url: '/register',
    method: 'post',
    data: {
      telephone,  // required
      username, // required
      sex, // required
      password // required
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
 * 字典分页接口
 *
 * 需要 token 和 cookie
 */
{
  url: '/dictList',
  method: 'get',
  params: {
    pageSize,
    pageNumber,
    name
  }
}