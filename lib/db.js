import mysql from 'mysql2';
import { config } from 'dotenv';

config();

const pool = mysql.createPool({
  host: '199.223.115.143',
  user: process.env.DBUSER,
  database: process.env.DBNAME,
  password: process.env.DBPASS,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true // Add this to allow multiple statements
});

const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    console.log('Executing query:', sql);
    console.log('Query parameters:', values);
    
    // Check if database is selected before executing query
    if (!pool.config.connectionConfig.database) {
      reject(new Error('No database selected'));
      return;
    }
    
    pool.query(sql, values, (error, results) => {
      if (error) {
        console.error('Query error:', error);
        reject(error);
      } else {
        console.log('Query results:', results);
        resolve(results);
      }
    });
  });
};

const beginTransaction = () => {
  return new Promise((resolve, reject) => {
    console.log('Attempting to start transaction...');
    
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Connection error:', err);
        reject(err);
      } else {
        // Check if database is selected before starting transaction
        if (!pool.config.connectionConfig.database) {
          connection.release();
          reject(new Error('No database selected'));
          return;
        }

        connection.beginTransaction((err) => {
          if (err) {
            console.error('Transaction start error:', err);
            connection.release();
            reject(err);
          } else {
            console.log('Transaction started successfully');
            resolve(connection);
          }
        });
      }
    });
  });
};

const commitTransaction = (connection) => {
  return new Promise((resolve, reject) => {
    console.log('Attempting to commit transaction...');
    
    connection.commit((err) => {
      connection.release();
      if (err) {
        console.error('Transaction commit error:', err);
        reject(err);
      } else {
        console.log('Transaction committed successfully');
        resolve();
      }
    });
  });
};

const rollbackTransaction = (connection) => {
  return new Promise((resolve, reject) => {
    console.log('Rolling back transaction...');
    
    connection.rollback(() => {
      connection.release();
      console.log('Transaction rolled back successfully');
      resolve();
    });
  });
};

export default query;
