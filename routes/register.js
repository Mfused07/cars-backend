const express = require('express')
const bcrypt = require("bcrypt")
const mysql = require("mysql")
const router = express.Router()
const db = require('../db/connect')

router.post("/", async (req,res) => {

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


})

module.exports = router