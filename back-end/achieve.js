const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

const users = require("./users.js");
const User = users.model;
const validUser = users.valid;

const achievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  id: '',
  name: String,
  description: String,
  imagePath: String,
  unlocked: Boolean
});
const Achievement = mongoose.model('Achievement', achievementSchema);

//Create Achievements
router.post("/", validUser, async (req, res) => {
    const achievement = new Achievement({
    user: req.user,
    name: req.body.name,
    description: req.body.description,
    imagePath: req.body.imagePath,
    unlocked: req.body.unlocked
  });
  try {
    await achievement.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});
//Return Achievements
router.get("/", validUser, async (req, res) => {
  try {
    let achievements = await Achievement.find({
      user: req.user
    }).sort({
      created: -1
    }).populate('user');
    return res.send(achievements);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = {
	model: Achievement,
	routes: router
}
