import { registerAs } from '@nestjs/config';

export const EnvironmentVariables = registerAs('config', () => {
  return {
    environment: process.env.NODE_ENV,
    app: {
      driver: {
        storageDriver: process.env.STORAGE_DRIVER,
        tokenDriver: process.env.TOKEN_DRIVER,
        cryptographyDriver: process.env.CRYPTOGRAPHY_DRIVER,
      },
      frontWebUrl: process.env.FRONT_WEB_URL,
      serverUrl: process.env.SERVER_URL,
      port: process.env.PORT,
    },
    database: {
      uri: process.env.MONGODB_CONNECTION,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
    bunny: {
      apiKey: process.env.BUNNY_API_KEY,
      hostname: process.env.BUNNY_HOSTNAME,
      storageName: process.env.BUNNY_STORAGE_NAME,
    },
    s3: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      region: process.env.S3_REGION,
      bucket: process.env.S3_BUCKET,
      baseUrl: process.env.S3_BASE_URL,
    },
  };
});
