import prisma from '../../../lib/prisma'
import { ComparePasswords, GenerateAccessToken } from "@/lib/auth";
import { VerifyAccessToken } from '../../../middleware/middleware';
import axios from 'axios';
import {tgcrm} from '../../../utils/const'
// const Login = async (req, res) => {
  
//   const { email, password } = req.body;
//   const {token} = req.query;

//   try{

//     if(!token){
//       if (!email || !password) {
//         return res.status(200).json({success: false, message: "Email and password are required", response: null });
//       }
//     }

//     let emailQuery = VerifyAccessToken(token);

//     // if(emailQuery == null){
//     //   return res.status(200).json({success:false, message: "In-valid token", response: null });
//     // }

//     let user = await prisma.users.findMany({
//       select:{
//         id: true,
//         name:true,
//         email: true,
//         image: true,
//         type: true,
//         trello_id: true,
//         team_key: true,
//         password: true,
//       },
//       where: { email: emailQuery || email },
//     });

//     if(user.length == 0){
//       return res.status(200).json({success: false, message: "Account not exist", response: null});
//     }

//     user = user[0];
    
//     if(!await ComparePasswords(password,user.password)){

//       res.status(200).json({success: false, message:"Email or Password incorrect.", response: null});
//       return;
//   }

//     delete user.password;

//     user.id = parseInt(user.id);
//     user.access_token = GenerateAccessToken(user.email);
//     user.token_type = "Bearer"

//     return res.status(200).json({success: true, message: "Logged successfully", user});

//   }catch(error){
//     console.log('er---> ',error);
//     return res.status(400).json({success: false, message: "Server not responsding", response: null});
//   }
// }


const Login = async (req, res) => {
  
  const { token } = req.query;
  try{

    let response = await axios.get(`${tgcrm}api/user`, {
      headers: {
        Authorization: `Bearer ${
          token
        } `,
      },
    });

    res.setHeader("Set-Cookie", `access_token=${token}; HttpOnly; Path=/; Max-Age=604800; Secure`);
    response = response.data;
    return res.status(200).json({success: true, message: "Logged successfully", response });

  }catch(error){
    console.log('er---> ',error);
    return res.status(400).json({success: false, message: "Server not responsding", response: null});
  }
}


export default Login;
