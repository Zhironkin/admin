const qs = require('qs');
const axios = require('axios');

const authToken = sessionStorage.getItem('authToken');
const headers = {
  'X-Api-Version': 1,
  Authorization: `bearer ${authToken}`
};

export class Controller {
  static isAuth() {
    return new Promise((resolve, reject) => {
      if (!authToken || typeof (authToken) == 'undefined') return reject({message: 'Токен отсутствует', ok: false});

      // axios('http://127.0.0.1:1166/check', {
      axios('https://api.optimargin.com/check', {
        method: 'get',
        headers
      })
        .then((result) => {
          resolve(result);
        })
        .catch((e) => {
          reject(e);
        });
    })
  }

  static checkAuth(login, pass) {
    return new Promise((resolve, reject) => {
      axios.post('https://api.optimargin.com/oauth/', {appid: "admin", apikey: "NaN" })
      // axios.post('http://127.0.0.1:1166/oauth/', {appid: login, apikey: pass})
      // axios.post('https://api.optimargin.com/oauth/', {appid: login, apikey: pass})
        .then((result) => {
          resolve(result);
        })
        .catch((e) => {
          reject(e);
        });
    })
  }

  static getList(url, page, limit) {
    return axios(url, {
      method: 'get',
      headers,
      params: {
        'offset': page * limit,
        'limit': limit,
      },
    })
  }

  static getSwitches(url, page, limit) {
    return axios(url, {
      method: 'get',
      headers,
      params: {
        'offset': page * limit,
        'limit': limit,
        'fromAdmin': 1
      },
    })
  }

  static getUpdts(url, page, limit, query) {
    return axios(url, {
      method: 'get',
      headers,
      params: {
        'offset': page * limit,
        'limit': limit,
        'reverse': 1,
        'query': query
      },
    })
  }

  static getSt(url, page, limit, query) { //????
    return axios(url, {
      method: 'get',
      headers,
      params: {
        'offset': page * limit,
        'limit': limit,
        'reverse': 1,
        'query': query
      },
    })
  }


  static getUpdatesVersions() {
    return axios('https://api.optimargin.com/Updates/versions', {
      method: 'get',
      headers,
    })
  }


  static getLogsList(url, filter) {
    return axios(url, {
      method: 'get',
      headers,
      params: filter
    })
  }

  static getLogUser(url) {
    return axios(url, {
      method: 'get',
      headers,
    })
  }


  static addUser(data) {
    return axios('https://api.optimargin.com/user', {
      method: 'post',
      headers,
      data: data
    })
  }


  static addSwitch(data) {
    return axios('https://api.optimargin.com/switches', {
      method: 'put',
      headers,
      data: data
    })
  }


  static removeUser(id) {
    return axios('https://api.optimargin.com/user/' + id, {
      method: 'delete',
      headers,
    })
  }


  static removeSwitch(id) {
    return axios('https://api.optimargin.com/switches/' + id, {
      method: 'delete',
      headers,
    })
  }


  static infoUser(id) {
    return axios('https://api.optimargin.com/user/' + id, {
      method: 'get',
      headers,
    })
  }


  static infoSwitch(id) {
    return axios('https://api.optimargin.com/switches/' + id, {
      method: 'get',
      headers,
    })
  }


  static editUser(id, data) {
    return axios('https://api.optimargin.com/user/' + id, {
      method: 'put',
      headers,
      data: data
    })
  }


  static editSwitch(id, data) {
    return axios('https://api.optimargin.com/switches/' + id, {
      method: 'post',
      headers,
      data: data
    })
  }


  static getTagList() {
    return axios('https://api.optimargin.com/git/tags', {
      method: 'get',
      headers,
    })
  }


  static getSources() {
    // return axios('http://127.0.0.1:1166/sources', {
    return axios('https://api.optimargin.com/sources', {
      method: 'get',
      headers,
    })
  }

  static addNewUpdates(data) {
    // return axios('http://127.0.0.1:1166/build/update', {
    return axios('https://api.optimargin.com/build/update', {
      method: 'post',
      headers,
      data: data
    })
  }

  static publishNewUpdates(data) {

    // return axios('http://127.0.0.1:1166/build', {
    return axios('https://api.optimargin.com/update/publish', {
      method: 'post',
      headers,
      data: data
    })
  }


  static sendUpdateNotify(data) {

    // return axios('http://127.0.0.1:1166/update/sendNotify', {
    return axios('https://api.optimargin.com/update/sendNotify', {
      method: 'post',
      headers,
      data: data
    })
  }

  static publishNewInstall(data) {

    // return axios('http://127.0.0.1:1166/build', {
    return axios('https://api.optimargin.com/install/publish', {
      method: 'post',
      headers,
      data: data
    })
  }

  static addNewInstall(data) {
    // return axios('http://127.0.0.1:1166/build/install', {
    return axios('https://api.optimargin.com/build/install', {
      method: 'post',
      headers,
      data: data
    })
  }

  static getBuildLog(pid) {
    // return axios('http://127.0.0.1:1166/build/log/' + pid, {
    return axios('https://api.optimargin.com/build/log/' + pid, {
      method: 'get',
      headers,
    })
  }

  static infoNewUpdate(id) {
    return axios('https://api.optimargin.com/NewUpdates/' + id, {
      method: 'get',
      headers,
    })
  }

  static getNoticedUsers(update) {
    return axios('https://api.optimargin.com/update/getNoticedUsers', {
      method: 'post',
      headers,
      data: update
    })
  }

  static removeNewUpdates(id) {
    return axios('https://api.optimargin.com/NewUpdates/' + id, {
      method: 'delete',
      headers,
    })
  }

  static addUpdates(data) {
    return axios('https://api.optimargin.com/autoupdates/create', {
      method: 'post',
      headers,
      data: data
    })
  }

  static saveUpdates(data) {
    return axios('https://api.optimargin.com/autoupdates/update', {
      method: 'post',
      headers,
      data: data
    })
  }

  static removeUpdates(id) {
    return axios('https://api.optimargin.com/updates/' + id, {
      method: 'delete',
      headers,
    })
  }

  static addNotification(data) {
    // console.log(data)
    return axios('https://api.optimargin.com/notification', {
      method: 'post',
      headers,
      data: {notification: data}
    })
  }

  static getPositionLimits(page, limit) {
    return axios('https://api.optimargin.com/PositionLimits/', {
      method: 'get',
      headers,
      params: {
        'offset': page * limit,
        'limit': limit
      },
    })
  }


  static removePositionLimits(id) {
    return axios('https://api.optimargin.com/PositionLimits/' + id, {
      method: 'delete',
      headers,
    })
  }

  static createPositionLimits(data) {
    return axios('https://api.optimargin.com/PositionLimits/', {
      method: 'put',
      headers,
      data: data
    })
  }

  static updatePositionLimits(id, data) {
    return axios('https://api.optimargin.com/PositionLimits/' + id, {
      method: 'post',
      headers,
      data: data
    })
  }

  static stopTask(id) {
    return axios('https://api.optimargin.com/ondemand/task/stop/' + id, {
      method: 'post',
      headers,
      data: {}
    })
  }

  static approveTaskEmail(id) {
    // return axios('http://127.0.0.1:1166/ondemand/task/approve/' + id, {
    return axios('https://api.optimargin.com/ondemand/task/approve/' + id, {
      method: 'post',
      headers,
      data: {}
    })
  }


  static getTaskEmailHtml(id) {
    // return axios('http://127.0.0.1:1166/ondemand/task/approve/' + id, {
    return axios('https://api.optimargin.com/ondemand/task/' + id + "/email", {
      method: 'get',
      headers,
      data: {}
    })
  }

  static setTaskEmailHtml(id, html) {
    // return axios('http://127.0.0.1:1166/ondemand/task/approve/' + id, {
    return axios('https://api.optimargin.com/ondemand/task/' + id + "/email", {
      method: 'put',
      headers,
      data: {html}
    })
  }
}
