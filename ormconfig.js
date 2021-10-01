const baseConfig =
  process.env.NODE_ENV === 'development'
    ? {
        entities: [`${__dirname}/src/database/entities/**/*.ts`],
        migrations: [`${__dirname}/src/database/migrations/*.ts`],
      }
    : {
        entities: [`${__dirname}/build/database/entities/**/*.js`],
        migrations: [`${__dirname}/build/database/migrations/*.js`],
      };

const baseOptions = {
  ...baseConfig,
  cli: {
    migrationsDir: `${__dirname}/src/database/migrations`,
    entitiesDir: `${__dirname}/src/database/entities`,
  },
  host: process.env.DB_HOST,
  logging: false,
  password: process.env.DB_PASS,
  port: 5432,
  type: 'postgres',
  username: process.env.DB_USER,
  autoLoadEntities: true,
  name: process.env.DB_NAME,
  database: process.env.DB_NAME,
  synchronize: true,
  ssl: {
    rejectUnauthorized: false,
  },
};

module.exports = [
  Object.assign({}, baseOptions, {
    synchronize: true,
    logging: process.env.LOG === '1',
  }),
];
