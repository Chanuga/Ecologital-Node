const express = require('express');
const { register, login, getUsers, getUser, updateUser, deleteUser } = require('../controllers/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.route('/users').get(getUsers);
router.route('/users/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
