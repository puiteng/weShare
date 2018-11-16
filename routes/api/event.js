const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Event = require("../../models/Event");
const Bill = require("../../models/Bill");

const validateEventInput = require("../../validations/event");

//@route POST api/event
//@desc Create post
//@access private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    const error = validateEventInput(req.body);
    const isValid = error == null;

    //Check validation
    if (!isValid) {
      errors.inputError = error.details[0].message;
      return res.status(400).json(errors);
    }

    const newEvent = new Event({
      name: req.body.name,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      friends: req.body.friends,
      createdBy: req.user.id
    });

    newEvent
      .save()
      .then(event => res.json(event))
      .catch(err => {
        res.status("400").json(err);
      });
  }
);

//@route POST api/event/:id
//@desc Edit event
//@access private
router.post(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    const error = validateEventInput(req.body);
    const isValid = error == null;

    //Check validation
    if (!isValid) {
      errors.inputError = error.details[0].message;
      return res.status(400).json(errors);
    }

    const eventFields = {
      name: req.body.name,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      friends: req.body.friends,
      createdBy: req.user.id
    };

    Event.findById(req.params.id)
      .then(event => {
        if (event) {
          if (event.createdBy != req.user.id) {
            return res
              .status(401)
              .json({ noauthorized: "Event not belong to user." });
          }
          Event.findByIdAndUpdate(
            req.params.id,
            { $set: eventFields },
            { new: true },
            function(err, tank) {
              if (err) console.log(err);
              res.json(tank);
            }
          );
        } else {
          return res.status(404).json({ noEvent: "No event found." });
        }
      })
      .catch(err => res.status("400").json(err));
  }
);

//@route GET api/event/
//@desc Get friend
//@access private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Event.find({ createdBy: req.user.id })
      .then(events => {
        return res.json(events);
      })
      .catch(err => res.status("400").json(err));
  }
);

//@route GET api/event/:id
//@desc Get event
//@access private
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.params.id);
    Event.findById(req.params.id)
      .then(event => {
        if (event) {
          if (
            event.createdBy.toString() != req.user.id &&
            event.friends.indexOf(req.user.id) === -1
          ) {
            return res
              .status(401)
              .json({ noauthorized: "Event not belong to user." });
          } else {
            Bill.find({ event: event._id })
              .then(bills => {
                return res.json({
                  _id: event._id,
                  name: event.name,
                  startDate: event.startDate,
                  endDate: event.endDate,
                  friends: event.friends,
                  createdBy: event.createdBy,
                  date: event.date,
                  bills: bills
                });
              })
              .catch(err => res.status("400").json(err));
          }
          //return res.json(event);
        } else {
          return res.status(404).json({ noEvent: "No event found." });
        }
      })
      .catch(err => res.status("400").json(err));
  }
);

// @route   DELETE api/event/:id
// @desc    Delete post
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Event.findById(req.params.id)
      .then(event => {
        if (event.createdBy != req.user.id) {
          return res
            .status(401)
            .json({ noauthorized: "Event not belong to user." });
        }
        event.remove().then(() => res.json({ success: true }));
      })
      .catch(err => res.status(404).json({ friendNotFound: "No event found" }));
  }
);

module.exports = router;
