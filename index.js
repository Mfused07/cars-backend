const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
const jwt = require('jsonwebtoken')
const app = express();
const bcrypt = require("bcrypt")

//setup db

const db = mysql.createPool({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'car',
	multipleStatements: true
 })



// to use session record (user loggedin or not)
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));




//temp page to check login
// http://localhost:3000/
app.get('/', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/login.html'));
});




//login
app.post("/login", (req, res)=> {
	const user = req.body.username
	const password = req.body.password

	db.getConnection ( async (err, connection)=> {
		if (err) throw (err)

		const sqlSearch = "Select * from user where name = ?"
		const search_query = mysql.format(sqlSearch,[user])

		await connection.query (search_query, async (err, result) => {
			connection.release()
	  
			if (err) throw (err)

			if(result.length == 0) {
				console.log("--------> User does not exist")
				res.sendStatus(404)
			} 
			else {
				console.log("user exist...")
				const hashedPassword = result[0].password.toString()

		 		//get the hashedPassword from result
				if (await bcrypt.compare(password, hashedPassword)) {
					console.log("---------> Login Successful")
					res.send(`${user} is logged in!`)

				} 
				else {
					console.log("---------> Password Incorrect")
					res.send("Password incorrect!")
				} 

	  		}
		}) 
	}) 
}) 



//sign up
app.post("/register", async (req,res) => {

	console.log("req pass hash body: ",req.body.password)
	const name = req.body.name
	const email = req.body.email
	const hashedPassword = await bcrypt.hash(req.body.password,10);
	const address  = req.body.address 
	const phone = req.body.phone;
	if (name && email && hashedPassword && address && phone) {
		db.getConnection( async (err, connection) => {
			if (err) throw (err)
			const sqlSearch = "SELECT * FROM user WHERE name = ?"
			const search_query = mysql.format(sqlSearch,[name])
			const sqlInsert = "INSERT INTO user VALUES (0,?,?,?,?,?)"
			const insert_query = mysql.format(sqlInsert,[name, email, hashedPassword, address, phone ])
			// ? will be replaced by values
			// ?? will be replaced by string
			await connection.query (search_query, async (err, result) => {
				if (err) throw (err)
				console.log("------> Search Results")
				console.log(result.length)
	
				if (result.length != 0) {
				connection.release()
				console.log("------> User already exists")
				res.sendStatus(409) 
				} 
				else {
					await connection.query (insert_query, (err, result)=> {
					connection.release()
					if (err) throw (err)
					console.log ("--------> Created new User")
					console.log(result.insertId)
					res.sendStatus(201)
				})
				}
			}) //end of connection.query()
		}) //end of db.getConnection()

	}


}) //end of app.post()
//sign up


//create order (it will contain )
//update order details

app.post("/create-order", async (req,res) => {
	
	const shippingAddress = req.body.shippingAddress
	const phone = req.body.phone
	const userId = req.body.userId
	const total = req.body.total
	const productId = req.body.productId

	const quantity = req.body.quantity
	

	if(shippingAddress && phone && userId && total){
		let sqlInsert = "INSERT INTO orders VALUES (0,?,?,?,?)"
		const insert_query_order = mysql.format(sqlInsert,[shippingAddress, phone, userId, total ])
		try {
			db.query(insert_query_order,(error, result)=> {
				if (error) {
					console.log(error)
					res.send(error)
				}
				else{
					//Create Order
					console.log ("--------> Order Created",result.insertId)
					console.log(result)
					const orderId = result.insertId


					// Create Order Details when Order Created and update Stock
					sqlInsert = `INSERT INTO orderdetails VALUES (0,${orderId}, ${productId}, ${quantity}); UPDATE products SET stock = stock - ${quantity} WHERE id = ${productId}`

					db.query(sqlInsert,(error, result)=> {
						if(error){
							res.send(error)
							console.log(error)
						}
						console.log("---------> orderDetails Created and Updated Stock",orderId)
						console.log(result)
						res.sendStatus(201)
						
					})
				}
			})

		}catch(error){console.log(error)}
	}
})

						

app.get("/products", async (req,res) => {
	
	try {
		db.query('SELECT * from products',(error, result)=> {
			console.log(result.length)
			if (error) {
				res.status(400).json({error})
			}
			if(result.length < 1) {
				res.status(404).send({
				status: 'Failed',
				message: 'No information found'
				});
			}
			if(result.length >= 1){
				console.log("Showing products...")
				res.send(result)
			}
	
		})
	}catch(error){
		console.log(error)
		}

})






// http://localhost:port/home
app.get('/home', function(request, response) {
	// If the user is loggedIn
	if (request.session.loggedIn) {
		// Output username
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();
});

app.listen(5555, ()=> {
    console.log(`server is Live on Port:5555`)
})
