import * as Joi from 'joi';

export const EnvironmentVariablesSchema = Joi.object({
  NODE_ENV: Joi.string().valid('staging', 'production').default('staging'),
  FRONT_WEB_URL: Joi.string().required(),
  SERVER_URL: Joi.string().required(),
  PORT: Joi.number().required(),
  STORAGE_DRIVER: Joi.string().required(),
  TOKEN_DRIVER: Joi.string().required(),
  CRYPTOGRAPHY_DRIVER: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
  BUNNY_API_KEY: Joi.string().allow(''),
  BUNNY_HOSTNAME: Joi.string().allow(''),
  BUNNY_STORAGE_NAME: Joi.string().allow(''),
  S3_ACCESS_KEY_ID: Joi.string().allow(''),
  S3_SECRET_ACCESS_KEY: Joi.string().allow(''),
  S3_REGION: Joi.string().allow(''),
  S3_BUCKET: Joi.string().allow(''),
  S3_BASE_URL: Joi.string().allow(''),
});
