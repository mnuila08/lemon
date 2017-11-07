
//get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    Schema = mongoose.Schema;


var UserSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true
  },
  hash_password: {
    type: String,
    required: true
  }
});

  UserSchema.methods.comparePassword = function(password){
      return bcrypt.compareSync(password, this.hash_password);
  };


module.exports = mongoose.model('User', UserSchema);
