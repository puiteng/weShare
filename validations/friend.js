const Joi = require("joi");

const schema = Joi.object().keys({
  name: Joi.string()
    .min(3)
    .max(30)
    .required(),
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required(),
  backgroundColor: Joi.string().required(),
  colorNumber: Joi.number().required(),
  text: Joi.string().required(),
  userId: Joi.string(),
  isCurrentUser: Joi.boolean(),
  createdBy: Joi.string()
});

module.exports = function validateFriendInput(data) {
  const { error, value } = Joi.validate(data, schema);
  return error;
};
