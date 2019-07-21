// BEGIN DEPENDENCIES
// Express
const express=require('express');
const app=express();

// Body-Parser
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));
// END DEPENDENCIES

// BEGIN
const user = require('./routes/user.route');
const role = require('./routes/role.route');
const produit = require('./routes/produit.route');

app.use("/user", user);
app.use("/role", role);
app.use("/produit", produit);

app.listen(9090);
// END