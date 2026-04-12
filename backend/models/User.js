const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },

  email: { type: String, required: true, unique: true, trim: true },

  password: { type: String }, // 🔥 optional (manual users ke liye)

  googleId: { type: String }, // 🔥 OAuth users ke liye

  avatar: { type: String }, // 🔥 Google DP ya custom DP

  joinedCommunities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community'
  }]
}, { timestamps: true });


// 🔐 PASSWORD HASHING
userSchema.pre('save', async function(next) {
  // agar password hi nahi hai (Google user)
  if (!this.password) return next();

  // agar already hashed hai ya change nahi hua
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});


// 🔐 PASSWORD CHECK
userSchema.methods.comparePassword = async function(candidatePassword) {
  // Google user ke paas password hi nahi hota
  if (!this.password) {
    throw new Error("Use Google login for this account");
  }
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);