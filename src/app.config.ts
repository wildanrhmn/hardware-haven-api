export default () => ({
    port: parseInt(process.env.PORT, 10) || 3002,
    database: {
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    },
    secretKey: process.env.SECRET_KEY,
    secretJwt: process.env.JWT_SECRET,
    expirationJwt: process.env.JWT_EXPIRATION_TIME,
  });