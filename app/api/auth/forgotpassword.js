import prisma from "../../../lib/prisma";
import { GenerateAccessToken } from "@/lib/auth";

const ForgetPassword = async (req, res) => {
  const { email } = req.body;

  try{

    if (!email) {
        return res.status(200).json({success: false, message: "Email is required", response: null });
    }


    let user = await prisma.users.findMany({
      select:{
        email: true,
      },
      where: { email },
    });

    if(user.length == 0){
      return res.status(200).json({success: false, message: "Account not exist", response: null});
    }
    
    user = user[0]

    const resetToken = GenerateAccessToken(user.email)
    
    const resetLink = `http://localhost:3000/forgotpassword?token=${resetToken}`;;


    return res.status(200).json({success: true, message: "Password link sent to your email", response: resetLink});

  }catch(error){
    console.log('er---> ',error);
    return res.status(400).json({success: false, message: "Server not responsding", response: null});
  }
}


export default ForgetPassword;
