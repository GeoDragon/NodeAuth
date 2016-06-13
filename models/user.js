var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodeauth');
var db = mongoose.connection;

//User Schema
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password:{
        type: String
    },
    email:{
        type: String
    },
    name:{
        type: String
    },
    profileImage:{
        type: String
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.comparePassword = function(username,password,callback){
    var query = User.findOne({
        username: username
    },{_id:0,username:1,password:1});
    var isMatch = false;
    if(query!=null){
        isMatch = true;
    }
    console.log(isMatch);
    callback(null, isMatch);
}

module.exports.getUserByUsername = function(username,callback){
    var query = {username: username};
    User.findOne(query,callback);
}

module.exports.getUserById = function(id,callback){
    User.findById(id,callback);
}

module.exports.createUser = function(newUser, callback){
    newUser.save(callback);
}