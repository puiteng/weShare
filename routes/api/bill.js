const express = require("express");
const router = express.Router();
const passport = require("passport");

const Bill = require("../../models/Bill");
const User = require("../../models/User");

const validateBillInput = require("../../validations/bill");

//@route POST api/bill
//@desc Create bill
//@access private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    const error = validateBillInput(req.body);
    const isValid = error == null;

    //Check validation
    if (!isValid) {
      errors.inputError = error.details[0].message;
      return res.status(400).json(errors);
    }

    const newBill = new Bill({
      description: req.body.description,
      billDate: req.body.billDate,
      items: req.body.items,
      sharedBy: req.body.sharedBy,
      paidBy: req.body.paidBy,
      event: req.body.event,
      createdBy: req.user.id
    });

    newBill
      .save()
      .then(bill => res.json(bill))
      .catch(err => {
        res.status("400").json(err);
      });
  }
);

//@route POST api/bill/:id
//@desc Edit bill
//@access private
router.post(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    const error = validateBillInput(req.body);
    const isValid = error == null;

    //Check validation
    if (!isValid) {
      errors.inputError = error.details[0].message;
      return res.status(400).json(errors);
    }

    const billFields = {
      description: req.body.description,
      billDate: req.body.billDate,
      items: req.body.items,
      sharedBy: req.body.sharedBy,
      paidBy: req.body.paidBy,
      event: req.body.event,
      createdBy: req.user.id
    };

    Bill.findById(req.params.id)
      .then(bill => {
        if (bill) {
          if (bill.createdBy != req.user.id) {
            return res
              .status(401)
              .json({ noauthorized: "Bill not belong to user." });
          }
          Bill.findByIdAndUpdate(
            req.params.id,
            { $set: billFields },
            { new: true },
            function(err, tank) {
              if (err) console.log(err);
              res.json(tank);
            }
          );
        } else {
          return res.status(404).json({ noBill: "No bill found." });
        }
      })
      .catch(err => res.status("400").json(err));
  }
);

//@route GET api/bill/:id
//@desc Get event
//@access public
router.get("/:id", (req, res) => {
  Bill.findById(req.params.id)
    .then(bill => {
      if (bill) return res.json(bill);
      return res.status(404).json({ noBill: "No bill found." });
    })
    .catch(err => res.status("400").json(err));
});

//@route GET api/bill/byevent/:id
//@desc Get event
//@access public
router.get("/byevent/:id", (req, res) => {
  Bill.find({ event: req.params.id })
    .then(bill => {
      if (bill) return res.json(bill);
      return res.status(404).json({ noBill: "No bill found." });
    })
    .catch(err => res.status("400").json(err));
});

// @route   DELETE api/bill/:id
// @desc    Delete post
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Bill.findById(req.params.id)
      .then(bill => {
        if (bill.createdBy != req.user.id) {
          return res
            .status(401)
            .json({ noauthorized: "Bill not belong to user." });
        }
        bill.remove().then(() => res.json({ success: true }));
      })
      .catch(err => res.status(404).json({ friendNotFound: "No bill found" }));
  }
);

module.exports = router;
