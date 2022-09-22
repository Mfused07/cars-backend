const express = require('express');
const session = require('express-session');
const path = require('path');
const jwt = require('jsonwebtoken')
const app = express();

//setup db
const db = require('./db/connect');
const port = 5555;

//routes
const login_route = require('./routes/login')
const register_route = require('./routes/register')

app.use(express.json());
app.use('/login',login_route)
app.use('/register', register_route)



app.listen(port,() => {console.log("listening on port 5555")});


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
