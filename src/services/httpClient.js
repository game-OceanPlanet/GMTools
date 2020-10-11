import axios from "axios"
import {getToken} from "./session";

var request = require('request')

// const loginGmtAddress = "http://www.siychina.com:10088/";
//  const loginGmtAddress = "http://192.168.1.36:10088/";
// const loginGmtAddress = "http://129.226.177.253:10088/";
const loginGmtAddress = "http://101.32.204.106:10088/";
// const loginGmtAddress = "http://129.226.177.253:10088/";

export const getHttpClient = function () {
  return request.defaults({
    baseUrl: loginGmtAddress,
    timeout: 5000,
    json: true,
    headers: {
      'Token': getToken()
    }
  });
};

export const getLoginHttpClient = function () {
  return request.defaults({
    baseUrl: loginGmtAddress,
    timeout: 5000,
    json: true,
    headers: {
      'Accept': 'text/html,application/xml,application/json'
    }
  });
};

export const getAxiosClient = function () {
  return axios.create({
    baseURL: loginGmtAddress,
    timeout: 5000,
    method: 'post'
  });
};


          // 向服务器发送认证信息
          // services.getAxiosClient().post("/dragon/login", {
          //       username: username,
          //       password: password,
          //       time: time,
          //       platform: platform,
          //       sign: sign,
          //   }).then((response) => {
          //     console.log(response);
          //     if (response.data.code != 0) {
          //       this.$Message.error(response.data.msg);
          //       return;
          //     }
          //     this.onLogin(username);
          //   }).catch((error) => {
          //     this.$Message.error(error.toString());
          //     return;
          //   });
          // return;

          // axios.defaults.baseURL = "/api";
          // const baseUrl = (process.env.NODE_ENV === 'development') ? '/api' : '';
          // export const getAxiosServer = function(){
          //   return axios.create({
          //     baseURL: baseUrl, // api 的 base_url
          //     timeout: 5000,
          //     method: 'post'
          //   });
          // }

          // axios.defaults.baseURL = loginGmtAddress;
          // axios.get('/dragon/login', {
          //   params: {
          //     username: username,
          //     password: password,
          //     time: time,
          //     platform: platform,
          //     sign: sign,
          //   }
          // })
          // return;

          // axios.post('/dragon/login', {
          //   username: username,
          //   password: password,
          //   time: time,
          //   platform: platform,
          //   sign: sign
          // })
          // .then(function (response) {
          //   console.log(response);
          // })
          // .catch(function (error) {
          //   console.log(error);
          // });


          // axios.get('/dragon/login').then(res => {
          //   console.log("============》》》："+res)
          // })

          // services.getAxiosClient().post("/dragon/allCount", {
          // }).then((response) => {
          //   console.log(response);
          //   if (response.data.code != 0) {
          //     this.$Message.error(response.data.msg);
          //     return;
          //   }
          //   this.onLogin(username);
          //   }).catch((error) => {
          //     this.$Message.error(error.toString());
          //     return;
          //   });






// // axios 中的GET请求
// axios.get('/user', {
//   params: {
//     ID: '001'
//   }
// })
// .then(function (response) {
//   console.log(response);
// })
// .catch(function (error) {
//   console.log(error);
// });

// // axios 中的POST请求
// axios.post('/user', {
//   firstName: '1',
//   lastName: '2'
// })
// .then(function (response) {
//   console.log(response);
// })
// .catch(function (error) {
//   console.log(error);
// });
