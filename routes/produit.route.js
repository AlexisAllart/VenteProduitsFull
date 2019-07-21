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
let multer = require('multer');
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
const produit_controller = require('../controllers/produit.controller');

router.get('/list', produit_controller.produit_list);
router.get('/details/:id', produit_controller.produit_details);
router.post('/create', checkToken, produit_controller.produit_create);
router.put('/edit/:id', checkToken, produit_controller.produit_edit);
router.put('/photo/:id', checkToken, upload.single('photo'), produit_controller.produit_photo);
router.delete('/delete/:id', checkToken, produit_controller.produit_delete);

module.exports = router;
// END