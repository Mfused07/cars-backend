const express = require('express')
const bcrypt = require("bcrypt")
const mysql = require("mysql")
const db = require('../db/connect')
const router = express.Router()

router.post("/", (req, res)=> {
    
	const user = req.body.username
	const password = req.body.password
    console.log(req.body.username)
    console.log(password)

        db.getConnection ( async (err, connection)=> {
        if (err) throw (err)

	 const sqlSearch = "Select * from user where name = ?"
	 const search_query = mysql.format(sqlSearch,[user])

	 connection.query (search_query, async (err, result) => {
        connection.release()
	  
	  if (err) throw (err)

	  if (result.length == 0) {
	   console.log("--------> User does not exist")
	   res.sendStatus(404)
	  } 
	  else {
		console.log("checking password...")
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

module.exports = router