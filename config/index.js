/*
 * @Description: 
 * @Version: 0.1
 * @Autor: wangmiao
 * @Date: 2021-03-20 22:05:53
 * @LastEditors: wangmiao
 * @LastEditTime: 2021-03-20 23:27:37
 */

const isDev = process.env.NODE_ENV === 'development'

const config = {
  ip: '0.0.0.0',
  port: 2333,
  database: {
    HOST: isDev ? '127.0.0.1' : 'mysql', // 数据库地址
    USER: 'root', // 数据库用户
    PORT: 3306,
    PASSWORD: '123456', // 数据库密码
    DATABASE: 'wechat-medicine' // 选中数据库
  },
  redis: {
    host: isDev ? '127.0.0.1' : 'redis',
    port: 6379
    // pass: 'wangmiao11111'
  }
}
module.exports = config
