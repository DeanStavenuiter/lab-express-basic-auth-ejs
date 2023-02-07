const router = require("express").Router();
const { isLoggedIn, isDean } = require('../middleware/route-guard')
const express = require('express')

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/profile', isLoggedIn , (req, res) => {

  res.render('profile', { user: req.session.user })
})

//creates route to funny cat page
router.get('/funnycat', isLoggedIn ,(req, res) => {
  res.render('funnycat')
})

router.get('/funnydog', isLoggedIn, (req, res) => {
  res.render('funnydog')
})

router.get('/private', isLoggedIn, isDean, (req, res) => {
  res.render('private')
})

module.exports = router;
