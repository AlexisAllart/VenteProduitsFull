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
// END DEPENDENCIES

// BEGIN LIST (PUBLIC)
exports.role_list = (req,res)=>{
    db.Role.findAll({})
    .then(roles=>{
        res.setHeader('Content-type','application/json ; charset=utf-8');
        res.json(roles);
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

// BEGIN CREATE NEW ROLE (PROTECTED BY ROLE_ID)
exports.role_create = (req,res)=>{
    jwt.verify(req.token, 'secureKey', (err, authorizedData) => {
        if(err){
            res.setHeader('Content-type','application/json ; charset=utf-8');
            console.log('ERROR: Could not connect to the protected route');
            res.sendStatus(403);
            res.end();
        }
        else {
            if(authorizedData.user.role_id==1) {
                db.Role.create({
                    name:req.body.name
                })
                .then(role=>{
                    res.setHeader('Content-type','application/json ; charset=utf-8');
                    res.json(role);
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
// END CREATE NEW ROLE (PROTECTED BY ROLE_ID)

// BEGIN EDIT (PROTECTED BY ROLE_ID)
exports.role_edit = (req,res)=>{
    jwt.verify(req.token, 'secureKey', (err, authorizedData) => {
        if(err){
            res.setHeader('Content-type','application/json ; charset=utf-8');
            console.log('ERROR: Could not connect to the protected route');
            res.sendStatus(403);
            res.end();
        }
        else {
            if(authorizedData.user.role_id==1) {
                db.Role.update({
                    name:req.body.name,
                    },{
                    where:{
                        'id':req.params.id
                    }
                })
                .then(role=>{
                    res.setHeader('Content-type','application/json ; charset=utf-8');
                    res.json(role);
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

// BEGIN DELETE (PROTECTED BY ROLE_ID)
exports.role_delete = (req,res)=>{
    jwt.verify(req.token, 'secureKey', (err, authorizedData) => {
        if(err){
            res.setHeader('Content-type','application/json ; charset=utf-8');
            console.log('ERROR: Could not connect to the protected route');
            res.sendStatus(403);
            res.end();
        }
        else {
            if(authorizedData.user.role_id==1) {
                db.Role.destroy({
                    where:{
                        'id': req.params.id
                    }
                })
                .then(role=>{
                    res.setHeader('Content-type','application/json ; charset=utf-8');
                    res.json('Role deleted');
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