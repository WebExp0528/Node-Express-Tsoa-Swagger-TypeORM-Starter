import { Connection, createConnection, getConnection } from 'typeorm';

export const getDbConnection = async (): Promise<Connection> => {
  const name = process.env.DB_NAME || 'gmail_ext';
  try {
    return getConnection(name);
  } catch {
    return await createConnection(name);
  }
};

export default getDbConnection;
