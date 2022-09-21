const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql')

const app = express()
const port = process.env.PORT || 5555

app.use(cors())
app.use(bodyParser.json())

//Connect SQL Server


const db = mysql.createConnection({
    host     : 'localhost',
    database : 'CarsDB',
    user     : 'root',
    password : '',
});

db.connect(function(err) {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }

    console.log('Connected as id ' + db.threadId);
});

db.query('SELECT * FROM users', function (error, results, fields) {
    if (error)
        throw error;

    results.forEach(result => {
        console.log(result);
    });
});




app.get('/users',(req, res)=> {
    

    db.query('SELECT * FROM users', function (error, results, fields) {
        if (error)
            throw error;
    
        results.forEach(result => {
            
            res.send(result)
        });
    });

})

app.listen(port, ()=> {
    console.log(`server is Live on Port: ${port}`)
})