// BEGIN DEPENDENCIES
// Express
let express = require('express');
let router = express.Router();

// JsonWebToken
const jwt = require('jsonwebtoken');
const checkToken = (req, res, next) => {
    const header = req.headers['authorization'];
    if(typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];
        req.token = token;
        next();
    }
    else {
        res.sendStatus(403);
    }
};

// Multer
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
const upload = multer({storage: storage});
// END DEPENDENCIES

// BEGIN
const user_controller = require('../controllers/user.controller');

router.get('/list', user_controller.user_list);
router.get('/profile/:id', checkToken, user_controller.user_profile);
router.post('/login', user_controller.user_login);
router.post('/create', user_controller.user_create);
router.put('/edit/:id', checkToken, user_controller.user_edit);
router.put('/avatar/:id', checkToken, upload.single('avatar'), user_controller.user_avatar);
router.delete('/delete/:id', checkToken, user_controller.user_delete);

module.exports = router;
// END