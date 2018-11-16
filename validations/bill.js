const Joi = require("joi");

const items = Joi.object().keys({
  description: Joi.string()
    .min(3)
    .max(200)
    .required(),
  amount: Joi.number().required(),
  quantity: Joi.number().required()
});

const sharedOrPaidBy = Joi.object().keys({
  friend: Joi.object().keys({
    _id: Joi.string().required(),
    name: Joi.string()
      .min(3)
      .max(30)
      .required(),
    email: Joi.string()
      .email({ minDomainAtoms: 2 })
      .required(),
    avatar: Joi.object().keys({
      backgroundColor: Joi.string().required(),
      colorNumber: Joi.number().required(),
      text: Joi.string().required()
    }),
    userId: Joi.string().allow(null),
    isCurrentUser: Joi.boolean()
  }),
  percentage: Joi.number(),
  actualAmount: Joi.number()
});
const schema = Joi.object().keys({
  event: Joi.string().required(),
  description: Joi.string()
    .min(3)
    .max(200),
  billDate: Joi.date().required(),
  items: Joi.array().items(items),
  sharedBy: Joi.array().items(sharedOrPaidBy),
  paidBy: Joi.array().items(sharedOrPaidBy),
  createdBy: Joi.string()
});

module.exports = function validateBillInput(data) {
  const { error, value } = Joi.validate(data, schema);
  return error;
};
