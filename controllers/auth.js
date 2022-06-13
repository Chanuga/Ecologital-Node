const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

//description   Register User
//@route        POST /api/v1/auth/register
//@access       Public
exports.register = asyncHandler(async (req, res, next) => {
	const { name, email, password, role } = req.body;

	//Create User
	const user = await User.create({
		name,
		email,
		password,
		role,
	});

	// Create Token
	const token = user.getSignedJwtToken();

	res.status(200).json({ success: true, token });
});

//description   Login User
//@route        POST /api/v1/auth/login
//@access       Public
exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	//Validate email and password
	if (!email || !password) {
		return next(new ErrorResponse('Please provide an Email and Password', 400));
	}

	// Check for user
	const user = await User.findOne({ email }).select('+password');
	console.log('user 38', user);

	if (!user) {
		return next(new ErrorResponse('Invalid Email or Password', 401));
	}

	// Check if password matches
	const isMatch = await user.matchPassword(password);

	if (!isMatch) {
		return next(new ErrorResponse('Invalid Email or Password', 401));
	}

	// Create Token
	const token = user.getSignedJwtToken();

	res.status(200).json({ success: true, token, user: user.role });
});

//description   Get all users
//@route        GET /api/v1/auth/users
//@access       Public
exports.getUsers = asyncHandler(async (req, res, next) => {
	const users = await User.find();
	res.status(200).json({ success: true, data: users });
});

//description   Get single user
//@route        GET /api/v1/auth/users/:id
//@access       Public
exports.getUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);
	console.log('user', user);
	if (!user) {
		return next(
			new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
		);
	}

	res.status(200).json({ success: true, data: user });
});

//description   Update user
//@route        PUT /api/v1/auth/users/:id
//@access       Privet
exports.updateUser = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!user) {
		return next(
			new ErrorResponse(`user can not found with id of ${req.params.id}`, 404)
		);
	}

	res.status(200).json({
		success: true,
		data: user,
	});
});

//description   delete user
//@route        DELETE /api/v1/auth/users/:id
//@access       Privet
exports.deleteUser = asyncHandler(async (req, res, next) => {
	const user = await User.findByIdAndDelete(req.params.id);

	if (!user) {
		return next(
			new ErrorResponse(`user can not found with id of ${req.params.id}`, 404)
		);
	}

	res.status(200).json({
		success: true,
		data: {},
	});
});
