const baseConfig = {
  type: 'mysql',
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/**/*.entity.{js,ts}'],
  logger: 'advanced-console',
  logging: ['warn', 'error'],
};

if (process.env.NODE_ENV !== 'test') {
  module.exports = {
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    synchronize: false,
    ...baseConfig,
  };
} else {
  module.exports = {
    dropSchema: true,
    synchronize: true,
    ...baseConfig,
  };
}
