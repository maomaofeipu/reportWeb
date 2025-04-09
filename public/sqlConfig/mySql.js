// mySql.js
const mysql = require('mysql')
const pool = mysql.createPool({
  host: 'localhost', // 数据库地址
  user: 'root', // 用户名
  password: 'root123', // 密码
  port: '3306', // 端口
  database: 'mysql' // 查询的数据库
})
//导出查询相关
var query = function (sql, callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      callback(err, null, null)
    } else {
      conn.query(sql, function (qerr, vals, fields) {
        //释放连接
        // conn.release();
        pool.releaseConnection(conn)
        //事件驱动回调
        callback(qerr, vals, fields)
      })
    }
  })
}
//向外暴露方法
module.exports = {
  pool,
  query
}
