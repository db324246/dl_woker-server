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