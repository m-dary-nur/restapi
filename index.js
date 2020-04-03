var app = require('restana')({})
var cors = require('cors')
var queryParser = require('connect-query')
var bodyParser = require('body-parser')
var fs = require('fs')

app.use(
	cors({
		origin: [
            /* 'https://api.service.whatever' */
            'http://localhost:13131',
            'http://192.168.43.58:13131',
            'http://192.168.43.58:13131',
		],
		allowedHeaders: ['scheduler-auth', 'Content-Type'],
		credentials: true
	})
)
app.use(queryParser())
app.use(bodyParser.json())
app.use((req, res, next) => {	    
	return next()
})

app.get('/', (req, res) =>
	res.send('Service is ready for ' + (process.env.NODE_ENV || 'development') + '.')
)

// auth
var auth = require('./services/auth')
app.post('/login', auth.login)
app.put('/forgot/:email', auth.forgot)

// users
var users = require('./services/users')
app.get("/users", users.get)
app.get("/users/:id", users.getById)
app.post("/users", users.create)
app.put("/users/:id", users.update)
app.delete("/users/:id", users.delete)

const port = 13131
app.start(port).then(server => {
	if (server) {
		console.log(
			'=====================================> Service running on port',
			server.address().port,
			'<====================================='
		)
	} else {
		console.log('Service failed to running server on port', port)
	}
})