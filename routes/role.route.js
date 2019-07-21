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
// END DEPENDENCIES

// BEGIN
const role_controller = require('../controllers/role.controller');

router.get('/list', role_controller.role_list);
router.post('/create', checkToken, role_controller.role_create);
router.put('/edit/:id', checkToken, role_controller.role_edit);
router.delete('/delete/:id', checkToken, role_controller.role_delete);

module.exports = router;
// END