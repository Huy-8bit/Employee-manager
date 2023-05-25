import { DataSource } from 'typeorm';
import { UserEntity } from './user/user.entity';

export const createNewDataSource = async (username: string, password: string) => {
  const newDataSoure = new DataSource({
    type: 'oracle',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: username,
    password: password,
    sid: process.env.DB_SID,
    entities: [UserEntity],
    synchronize: false,
  });
  return await newDataSoure.initialize()
};
