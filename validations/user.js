const Joi = require("joi");

const schema = Joi.object().keys({
  name: Joi.string()
    .min(3)
    .max(30)
    .required(),
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{6,20}$/)
    .required(),
  avatar: Joi.string()
});

const validateUserInput = data => {
  const { error, value } = Joi.validate(data, schema);
  return error;
};

const validateUserNameInput = data => {
  const { error, value } = Joi.validate(
    data,
    Joi.object().keys({
      name: Joi.string()
        .min(3)
        .max(30)
        .required()
    })
  );
  return error;
};

module.exports = {
  validateUserInput,
  validateUserNameInput
};
