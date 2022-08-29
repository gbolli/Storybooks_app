const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const connectDB = require('./config/db')

const app = express();

// Load config
dotenv.config({ path: './config/config.env' })

// Passport config
require('./config/passport')(passport)

const PORT = process.env.PORT

// Load database
connectDB();

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// EJS
// app.set('view engine', 'ejs')  ** Try Handlebars

// Handlebars
app.engine('.hbs', exphbs.engine({ defaultLayout: 'main', extName: '.hbs'}))
app.set('view engine', '.hbs')

// Session middleware (before passport)
app.use(session({
    secret: 'whateverIwant',
    resave: false,
    saveUninitialized: false
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)