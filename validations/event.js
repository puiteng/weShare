const Joi = require("joi");

const schema = Joi.object().keys({
  name: Joi.string()
    .min(3)
    .max(200)
    .required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  friends: Joi.array(),
  isCurrentUser: Joi.boolean(),
  createdBy: Joi.string()
});

module.exports = function validateEventInput(data) {
  const { error, value } = Joi.validate(data, schema);
  return error;
};
