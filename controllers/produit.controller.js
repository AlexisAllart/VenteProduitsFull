// BEGIN DEPENDENCIES
// Sequelize
let db = require(`../models/index.js`);

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

// BEGIN LIST (PUBLIC)
exports.produit_list = (req,res)=>{
    db.Produit.findAll({})
    .then(produits=>{
        res.setHeader('Content-type','application/json ; charset=utf-8');
        res.json(produits);
        res.status(200);
        res.end();
    })
    .catch(error=>{
        res.setHeader('Content-type','application/json ; charset=utf-8');
        res.json(error);
        res.status(400).send('400 Error');
        res.end();
    });
};
// END LIST (PUBLIC)

// BEGIN DETAILS (PUBLIC)
exports.produit_details = (req,res)=>{
        db.Produit.findOne({
            where:{
                'id': req.params.id
            }
        })
        .then(produit=>{
            res.setHeader('Content-type','application/json ; charset=utf-8');
            res.json(produit);
            res.status(200);
            res.end();
        })
        .catch(error=>{
            res.setHeader('Content-type','application/json ; charset=utf-8');
            res.json(error);
            res.status(400).send('400 Error');
            res.end();
        });
};
// END DETAILS (PUBLIC)

// BEGIN CREATE (PROTECTED BY ROLE_ID)
exports.produit_create = (req,res)=>{
    jwt.verify(req.token, 'secureKey', (err, authorizedData) => {
        if(err){
            res.setHeader('Content-type','application/json ; charset=utf-8');
            console.log('ERROR: Could not connect to the protected route');
            res.sendStatus(403);
            res.end();
        }
        else {
            if(authorizedData.user.role_id==1) {
                db.Produit.create({
                    name:req.body.name,
                    price:req.body.price,
                    photo:'./default/produit.jpg',
                    desc:req.body.desc
                })
                .then(produit=>{
                    res.setHeader('Content-type','application/json ; charset=utf-8');
                    res.json(produit);
                    res.status(200);
                    res.end();
                })
                .catch(error=>{
                    res.setHeader('Content-type','application/json ; charset=utf-8');
                    res.json(error);
                    res.status(400).send('400 Error');
                    res.end();
                });
            }
        }
    });
};
// END CREATE (PROTECTED BY ROLE_ID)

// BEGIN EDIT (PROTECTED BY ROLE_ID)
exports.produit_edit = (req,res)=>{
    jwt.verify(req.token, 'secureKey', (err, authorizedData) => {
        if(err){
            res.setHeader('Content-type','application/json ; charset=utf-8');
            console.log('ERROR: Could not connect to the protected route');
            res.sendStatus(403);
            res.end();
        }
        else {
            if(authorizedData.user.role_id==1) {
                db.Produit.update({
                    name:req.body.name,
                    price:req.body.price,
                    desc:req.body.desc
                    },{
                    where:{
                        'id':req.params.id
                    }
                })
                .then(produit=>{
                    res.setHeader('Content-type','application/json ; charset=utf-8');
                    res.json(produit);
                    res.status(200);
                    res.end();
                })
                .catch(error=>{
                    res.setHeader('Content-type','application/json ; charset=utf-8');
                    res.json(error);
                    res.status(400).send('400 Error');
                    res.end();
                });
            }
            else {
                res.setHeader('Content-type','application/json ; charset=utf-8');
                console.log('ERROR: Access Denied');
                res.sendStatus(403);
                res.end();
            }
        }
    });
};
// END EDIT (PROTECTED BY ROLE_ID)

// BEGIN PHOTO UPLOAD (PROTECTED BY ROLE_ID)
exports.produit_photo = (req,res)=>{
    jwt.verify(req.token, 'secureKey', (err, authorizedData) => {
        if(err){
            res.setHeader('Content-type','application/json ; charset=utf-8');
            console.log('ERROR: Could not connect to the protected route');
            res.sendStatus(403);
            res.end();
        }
        else {
            if(authorizedData.user.role_id==1 || authorizedData.user.id==req.params.id) {
                db.Produit.update({
                    photo:'./uploads/'+req.file.filename
                    },{
                    where:{
                        'id':req.params.id
                    }
                })
                .then(photo=>{
                    res.setHeader('Content-type','application/json ; charset=utf-8');
                    res.json('Photo uploaded');
                    res.status(200);
                    res.end();
                })
                .catch(error=>{
                    res.setHeader('Content-type','application/json ; charset=utf-8');
                    res.json(error);
                    res.status(400).send('400 Error');
                    res.end();
                });
            }
            else {
                res.setHeader('Content-type','application/json ; charset=utf-8');
                console.log('ERROR: Access Denied');
                res.sendStatus(403);
                res.end();
            }
        }
    });
};
// END PHOTO UPLOAD (PROTECTED BY ROLE_ID)

// BEGIN DELETE (PROTECTED BY ROLE_ID)
exports.produit_delete = (req,res)=>{
    jwt.verify(req.token, 'secureKey', (err, authorizedData) => {
        if(err){
            res.setHeader('Content-type','application/json ; charset=utf-8');
            console.log('ERROR: Could not connect to the protected route');
            res.sendStatus(403);
            res.end();
        }
        else {
            if(authorizedData.user.role_id==1) {
                db.Produit.destroy({
                    where:{
                        'id': req.params.id
                    }
                })
                .then(produit=>{
                    res.setHeader('Content-type','application/json ; charset=utf-8');
                    res.json('Produit deleted');
                    res.status(200);
                    res.end();
                })
                .catch(error=>{
                    res.setHeader('Content-type','application/json ; charset=utf-8');
                    res.json(error);
                    res.status(400).send('400 Error');
                    res.end();
                });
            }
            else {
                res.setHeader('Content-type','application/json ; charset=utf-8');
                console.log('ERROR: Access Denied');
                res.sendStatus(403);
                res.end();
            }
        }
    });
};
// END DELETE (PROTECTED BY ROLE_ID)