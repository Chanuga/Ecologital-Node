const express = require('express');
const dotenv = require('dotenv');
const logger = require('./middleware/logger');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const cors = require('cors');

//Load env vars
dotenv.config({ path: './config/config.env' });

//Connect to the DB
connectDB();

//Route files
const bootcamps = require('./routes/bootcamps');

const auth = require('./routes/auth');

const app = express();

app.use(cors());

//Body parser
app.use(express.json());

//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

//Mount routes
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/auth', auth);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
	PORT,
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

//Handle unhandle rejections
process.on('unhandledRejection', (err, promise) => {
	console.log(`Unhandled Rejectiion ${err.message}`);
	//Close server and exit
	server.close(() => process.exit(1));
});
