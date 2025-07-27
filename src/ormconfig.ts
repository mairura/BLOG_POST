import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'devuser',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'blog',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  // synchronize: true, //don't use in production
  logging: process.env.DB_LOGGING === 'true',
  migrationsTableName: 'migrations',
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
};

const AppDataSource = new DataSource(config);

export { AppDataSource };

export default config;
