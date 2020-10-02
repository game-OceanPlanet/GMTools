import Cookies from 'js-cookie'

function LoggedInUser() {
  this.username = '';
  this.platforms = '';
  this.authority = 0;
}

/**
 * 判断当前是否已登录
 */
export const isLoggedIn = function () {
  return !!Cookies.get('user');
};

/**
 * 设置已登录
 */
export const setLoggedIn = function (username, authority, platform) {
  let loggedInUser = new LoggedInUser();
  loggedInUser.username = username;
  loggedInUser.platform = platform;
  loggedInUser.authority = authority;
  Cookies.set('user', loggedInUser, {expires: 0.125});
};

/**
 * 设置已注销登录
 */
export const setLoggedOut = function () {
  Cookies.remove('user');
};

/**
 * 已登录用户
 */
export const getUser = function () {
  return Cookies.getJSON('user');
};

/**
 * 用户token
 */
export const getToken = function () {
  return "";
};

/**
 * 验证用户所属大区
 */
export const checkPlatform = function (platform) {
  return false
};

/**
 * 返回登录用户的默认大区
 */
export const getUserPlatform = function () {
  let user = Cookies.getJSON('user');
  if (!user) {
    return false
  }
  return user.platform;
};


/**
 * 检查用户查看数据统计权限
 */
export const checkAnalyAuthor = function () {
  let user = Cookies.getJSON('user');
  if (!user) {
    return false
  }
  return user.authority > 0
};

/**
 * 检查用户gmt权限
 * 一级：全部权限
 * 二级：查看跑马灯列表、玩家查询、元宝、禁言、封号
 * 三级：玩家查询、元宝、禁言
 */
export const checkGmtAuthor = function (authorLv) {
  let user = Cookies.getJSON('user');
  if (!user) {
    return false
  }

  if (user.authority === 0) {
    return false
  }

  return user.authority <= authorLv;
};

