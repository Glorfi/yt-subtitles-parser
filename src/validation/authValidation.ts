import { Joi } from 'celebrate';

export const authCredentialsConfig = {
  body: Joi.object().keys({
    password: Joi.string().min(4).max(10).required(),
    email: Joi.string().required().email({ tlds: false }),
  }),
};
