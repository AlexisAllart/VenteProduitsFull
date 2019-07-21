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

// Bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;
// END DEPENDENCIES

// BEGIN LIST (PUBLIC)
exports.user_list = (req,res)=>{
    db.User.findAll({})
    .then(users=>{
        res.setHeader('Content-type','application/json ; charset=utf-8');
        res.json(users);
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

// BEGIN DETAILS (PROTECTED BY ROLE_ID OR USER'S OWN ID)
exports.user_profile = (req,res)=>{
    jwt.verify(req.token, 'secureKey', (err, authorizedData) => {
        if(err){
            res.setHeader('Content-type','application/json ; charset=utf-8');
            console.log('ERROR: Could not connect to the protected route');
            res.sendStatus(403);
            res.end();
        }
        else {
            if(authorizedData.user.role_id==1 || authorizedData.user.id==req.params.id) {
                db.User.findOne({
                    where:{
                        'id': req.params.id
                    }
                })
                .then(user=>{
                    res.setHeader('Content-type','application/json ; charset=utf-8');
                    res.json(user);
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
// END DETAILS (PROTECTED BY ROLE_ID OR USER'S OWN ID)

// BEGIN LOGIN (PROTECTED BY PASSWORD)
exports.user_login = (req,res)=>{
    db.User.findOne({
        where:{
            name: req.body.name
        }
    })
    .then(user=>{
        if(!user){
            res.setHeader('Content-type','application/json ; charset=utf-8');
            res.json({'message':'Login = KO : User not found'});
            res.status(400);
            res.end();
        }
        bcrypt.compare(req.body.password, user.password, (err,result)=>{
            if (result) {
                // Creation du token
                jwt.sign({user}, 'secureKey', {expiresIn: '1h'}, (err, token)=>{
                    res.setHeader('Content-type','application/json ; charset=utf-8');
                    if(err) {
                        console.log(err);
                        res.status(400);
                    }
                    res.json(token);
                    res.status(200);
                    res.end();
                });
            }
            else {
                res.setHeader('Content-type','application/json ; charset=utf-8');
                res.json({'message':'Login = KO : Password does not match'});
                res.status(400);
                res.end();
            }
        });
    });
};
// END LOGIN (PROTECTED BY PASSWORD)

// BEGIN CREATE (PUBLIC) (NEW USER ROLE_ID = 2 (STANDARD USER), AVATAR = './default/avatar.jpg')
exports.user_create = (req,res)=>{
    bcrypt.hash(req.body.password, saltRounds, (err, hash)=> {
        db.User.create({
            name:req.body.name,
            age:req.body.age,
            email:req.body.email,
            avatar:'./default/avatar.jpg',
            password:hash,
            role_id:2
        })
        .then(user=>{
            res.setHeader('Content-type','application/json ; charset=utf-8');
            res.json(user);
            res.status(200);
            res.end();
        })
        .catch(error=>{
            res.setHeader('Content-type','application/json ; charset=utf-8');
            res.json(error);
            res.status(400).send('400 Error');
            res.end();
        });
    });
};
// END CREATE (PUBLIC) (NEW USER ROLE_ID = 2 (STANDARD USER), AVATAR = './default/avatar.jpg')

// BEGIN EDIT (PROTECTED BY ROLE_ID OR USER'S OWN ID)
exports.user_edit = (req,res)=>{
    jwt.verify(req.token, 'secureKey', (err, authorizedData) => {
        if(err){
            res.setHeader('Content-type','application/json ; charset=utf-8');
            console.log('ERROR: Could not connect to the protected route');
            res.sendStatus(403);
            res.end();
        }
        else {
            // ONLY ADMINS (ROLE_ID=1) CAN CHANGE ROLE_IDs
            if(authorizedData.user.role_id==1 || authorizedData.user.id==req.params.id && authorizedData.user.role_id==req.body.role_id) {
                bcrypt.hash(req.body.password, saltRounds, (err, hash)=> {
                    db.User.update({
                        name:req.body.name,
                        age:req.body.age,
                        email:req.body.email,
                        password:hash,
                        role_id:req.body.role_id
                        },{
                        where:{
                            'id':req.params.id
                        }
                    })
                    .then(user=>{
                        res.setHeader('Content-type','application/json ; charset=utf-8');
                        res.json(user);
                        res.status(200);
                        res.end();
                    })
                    .catch(error=>{
                        res.setHeader('Content-type','application/json ; charset=utf-8');
                        res.json(error);
                        res.status(400).send('400 Error');
                        res.end();
                    });
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
// END EDIT (PROTECTED BY ROLE_ID OR USER'S OWN ID)

// BEGIN AVATAR UPLOAD (PROTECTED BY ROLE_ID OR USER'S OWN ID)
exports.user_avatar = (req,res)=>{
    jwt.verify(req.token, 'secureKey', (err, authorizedData) => {
        if(err){
            res.setHeader('Content-type','application/json ; charset=utf-8');
            console.log('ERROR: Could not connect to the protected route');
            res.sendStatus(403);
            res.end();
        }
        else {
            if(authorizedData.user.role_id==1 || authorizedData.user.id==req.params.id) {
                db.User.update({
                    avatar:'./uploads/'+req.file.filename
                    },{
                    where:{
                        'id':req.params.id
                    }
                })
                .then(avatar=>{
                    res.setHeader('Content-type','application/json ; charset=utf-8');
                    res.json('Avatar uploaded');
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
// END AVATAR UPLOAD (PROTECTED BY ROLE_ID OR USER'S OWN ID)

// BEGIN DELETE (PROTECTED BY ROLE_ID OR USER'S OWN ID)
exports.user_delete = (req,res)=>{
    jwt.verify(req.token, 'secureKey', (err, authorizedData) => {
        if(err){
            res.setHeader('Content-type','application/json ; charset=utf-8');
            console.log('ERROR: Could not connect to the protected route');
            res.sendStatus(403);
            res.end();
        }
        else {
            if(authorizedData.user.role_id==1 || authorizedData.user.id==req.params.id) {
                db.User.destroy({
                    where:{
                        'id': req.params.id
                    }
                })
                .then(user=>{
                    res.setHeader('Content-type','application/json ; charset=utf-8');
                    res.json('User deleted');
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
// END DELETE (PROTECTED BY ROLE_ID OR USER'S OWN ID)