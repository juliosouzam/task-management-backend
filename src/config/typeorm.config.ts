import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import * as config from 'config';

type DBConfig = TypeOrmModuleOptions & {
  host: string;
  port: number;
  username: string;
  password: string;
};

const dbConfig = config.get('db') as DBConfig;

export const typeOrmConfig = {
  type: dbConfig.type,
  host: process.env.RDS_HOSTNAME || dbConfig.host,
  port: process.env.RDS_PORT || dbConfig.port,
  username: process.env.RDS_USERNAME || dbConfig.username,
  password: process.env.RDS_PASSWORD || dbConfig.password,
  database: process.env.RDS_DATABASE || dbConfig.database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize,
} as DBConfig;
