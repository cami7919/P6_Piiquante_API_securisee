const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true }, // doit etre entre 1 et 10
  likes: { type: Number },
  dislikes: { type: Number },
  usersLiked: { type: Array },//tableaux des id des users
  usersDisliked: { type: Array },
});

module.exports = mongoose.model('Sauce', sauceSchema);