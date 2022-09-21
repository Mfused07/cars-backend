const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql')

const app = express()
const port = process.env.PORT || 5555

app.use(cors())
app.use(bodyParser.json())

//Connect SQL Server

const config = {
    user: 'root',
    server: 'localhost',
    password: '',
    database: 'CarsDB',
    port: port,
    options: {
        trustServerCertificate: true
    }
}
console.log("test")
//Check DB Conn...
db = mysql.createConnection(config)



app.get("/", async(req, res) => {
    try {
        await db.connect()
        res.send(`DB ${config.database} Connected`)
    }catch(err) {
        console.log(err)
    }
})


app.get('/users',(req, res)=> {
    
    // try {
    let users = `SELECT * FROM users`


    db.query(users,(err,rows)=> {
        console.log("start")
        if(err){
            
            res.send(err)
            res.render('profile: ',{data: ''})
        }
        else{
            res.render('profile: ', {data: rows})
            // res.send({
            //     message : 'All users Data',
            //     data : result
            // })
            console.log(result)
        }
    })
    res.send("Get all users")

})

app.listen(port, ()=> {
    console.log(`server is Live on Port: ${port}`)
})