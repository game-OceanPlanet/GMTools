import axios from "axios"
import {getGmtAddr} from "./region";
import {getToken} from "./session";

var request = require('request')

export const getHttpClient = function () {
  return request.defaults({
    baseUrl: getGmtAddr(),
    timeout: 5000,
    json: true,
    headers: {
      'Token': getToken()
    }
  });
};

export const getLoginHttpClient = function () {
  return request.defaults({
    //baseUrl: 'http://192.168.0.108:3903/',
    baseUrl: 'http://jh-wb.tstd.black8.com.cn/',
    timeout: 5000,
    json: true
  });
};

export const getAxiosClient = function () {
  return axios.create({
    baseURL: getGmtAddr(),
    timeout: 5000,
    method: 'post'
  });
};
