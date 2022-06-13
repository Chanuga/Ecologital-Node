const mongoose = require('mongoose');

const connectDB = async () => {
	const conn = await mongoose.connect(process.env.MONGO_URI, {
		// useNewUrlParsel: true,
		// useCreateIndex: true,
		// useFindAndModify: false,
		// useUnifiedTopology: true,
	});

	console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
