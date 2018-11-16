const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Friend = require("../../models/Friend");
const User = require("../../models/User");

const validateFriendInput = require("../../validations/friend");

//@route POST api/friend
//@desc Create post
//@access private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    const error = validateFriendInput(req.body);
    const isValid = error == null;

    //Check validation
    if (!isValid) {
      errors.inputError = error.details[0].message;
      return res.status(400).json(errors);
    }
    let friendId = null;

    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        friendId = user._id;
      }

      const avatar = {};
      avatar.backgroundColor = req.body.backgroundColor;
      avatar.colorNumber = req.body.colorNumber;
      avatar.text = req.body.text;

      const newFriend = new Friend({
        name: req.body.name,
        avatar: avatar,
        isCurrentUser: req.body.isCurrentUser,
        email: req.body.email,
        createdBy: req.user.id,
        userId: friendId
      });

      newFriend
        .save()
        .then(friend => res.json(friend))
        .catch(err => {
          res.status("400").json(err);
        });
    });
  }
);

//@route GET api/friend/
//@desc Get friend
//@access private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Friend.find({ createdBy: req.user.id })
      .then(friends => {
        return res.json(friends);
      })
      .catch(err => res.status("400").json(err));
  }
);

//@route GET api/friend/:id
//@desc Get friend
//@access private
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Friend.findById(req.params.id)
      .then(friend => {
        if (friend) {
          if (friend.createdBy.toString() != req.user.id) {
            return res
              .status(401)
              .json({ noauthorized: "Friend not belong to user." });
          }
          return res.json(friend);
        }
        return res.status(404).json({ noFriend: "No friend found." });
      })
      .catch(err => res.status("400").json(err));
  }
);

// @route   DELETE api/friend/:id
// @desc    Delete post
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Friend.findById(req.params.id)
      .then(friend => {
        if (friend.userId === req.user.id) {
          return res
            .status(400)
            .json({ isCurrentUser: "User own profile cannot be deleted" });
        }
        if (friend.createdBy != req.user.id) {
          return res.status(401).json({ notauthorized: "User not authorized" });
        }
        friend.remove().then(() => res.json({ success: true }));
      })
      .catch(err =>
        res.status(404).json({ friendNotFound: "No friend found" })
      );
  }
);

//@route GET api/friend/multiple
//@desc Get friend
//@access private
/*router.get("/multiple", (req, res) => {
  Friend.find({ _id: { $in: req.params.ids } })
    .then(friends => {
      return res.json(friends);
    })
    .catch(err => res.status("400").json(err));
});*/

module.exports = router;
