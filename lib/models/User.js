const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id,
      delete ret.__v;
    }
  }
});

schema.virtual('password').set(function(password) {
  this.passwordHash = bcrypt.hashSync(password, +process.env.SALT_ROUNDS || 8);
});

schema.statics.authorized = function(email, password) {
  return this.findOne({ email })
    .then(user => {
      // if there is no user email found throw an ambiguous error
      if(!user) {
        throw new Error('Invalid Email/Password');
      }
      // if the password is incorrect throw an ambiguous error
      if(!user.compare(password)) {
        throw new Error('Invalid Email/Password');
      }

      return user;
    });
};

schema.methods.compare = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

module.exports = mongoose.model('User', schema);
