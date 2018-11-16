const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
const Joi = require("joi");

//Load Users Model
const User = require("../../models/User");
const Friend = require("../../models/Friend");

const userValidations = require("../../validations/user");
const utils = require("../../utils/utils");

//@route POST api/user/register
//@desc Register user
//@access public
router.post("/register", (req, res) => {
  const errors = {};
  const error = userValidations.validateUserInput(req.body);
  const isValid = error == null;

  //Check validation
  if (!isValid) {
    errors.inputError = error.details[0].message;
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists.";
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            throw err;
          }
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              const avatar = {
                backgroundColor: utils.generateRandomColor(),
                colorNumber: utils.generateRandomNumber(),
                text: utils.generateAvatarDisplayText(user.name)
              };
              const newFriend = new Friend({
                name: user.name,
                email: user.email,
                isCurrentUser: true,
                createdBy: user._id,
                userId: user._id,
                avatar: avatar
              });

              newFriend.save().catch(err => {
                console.log(err);
              });

              return res.json(user);
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//@route POST api/user/updatename
//@desc update user
//@access private
router.post(
  "/updatename",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    const error = userValidations.validateUserNameInput(req.body);
    const isValid = error == null;

    //Check validation
    if (!isValid) {
      errors.inputError = error.details[0].message;
      return res.status(400).json(errors);
    }

    const userFields = {
      name: req.body.name
    };

    User.findById(req.user.id)
      .then(user => {
        if (user) {
          User.findByIdAndUpdate(
            req.user.id,
            { $set: userFields },
            { new: true },
            function(err, tank) {
              if (err) console.log(err);
              res.json(tank.name);
            }
          );
        } else {
          return res.status(404).json({ noUser: "No user found." });
        }
      })
      .catch(err => res.status("400").json(err));
  }
);

//@route POST api/user/login
//@desc login
//@access public
router.post("/login", (req, res) => {
  const errors = {};
  const { error, value } = Joi.validate(req.body, {
    email: Joi.string().required(),
    password: Joi.string().required()
  });
  const isValid = error == null;

  //Check validation
  if (!isValid) {
    errors.inputError = error.details[0].message;
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //Find user by email
  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "User not found!";
      return res.status(404).json(errors);
    }

    //Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched

        const payload = {
          id: user.id,
          name: user.name,
          email: user.email
        };
        const expiresIn = 3600;
        //Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: expiresIn },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
              userId: user.id,
              expiresIn: expiresIn
            });
          }
        );
      } else {
        errors.password = "Password incorrect!";
        return res.status(400).json(errors);
      }
    });
  });
});

module.exports = router;
