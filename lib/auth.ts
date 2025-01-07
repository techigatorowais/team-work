const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET
const bcrypt = require('bcrypt');

export const GenerateAccessToken = (email:string) => {
    return jwt.sign(email, JWT_SECRET);
  };
  
export const ComparePasswords = (userPassword: string, storedHashedPassword: string) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(userPassword, storedHashedPassword, (error : any, result : any) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
})}