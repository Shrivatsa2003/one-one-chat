const mysql = require('mysql')

const db = mysql.createConnection({
    host:'localhost',
    user: "root",
    password: "Kishorevc444@",
    database: "snapy",
})

module.exports= db