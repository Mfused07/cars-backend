const mysql = require('mysql');

function dbconn(hostname, username, pass, dbname){
    return mysql.createPool({
        host     : hostname,
        user     : username,
        password : pass,
        database : dbname
     })
     
     
}
db = dbconn('localhost', 'root', '','car');
    



module.exports = db