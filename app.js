const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db')


const app = express();

// Body Parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

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

// Handlebars Helpers
const { formatDate } = require('./helpers/hbs')

// Handlebars
app.engine('.hbs', 
            exphbs.engine({ 
                helpers: { formatDate },
                defaultLayout: 'main', 
                extName: '.hbs'        
            })
)
app.set('view engine', '.hbs')
// TODO - investigate extensions, why do layouts and partials need to be .handlebars but views and errors to not?

// Session middleware (before passport)
app.use(
    session({
        secret: 'whateverIwant',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
    })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)