const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const connectDB = require('./config/db')

const app = express();

// Load config
dotenv.config({ path: './config/config.env' })

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

// Routes
app.use('/', require('./routes/index'))

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)