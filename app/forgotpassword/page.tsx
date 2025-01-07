"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { newForgetPassword } from "../../pages/api/auth/newForgotPassword";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [isForgetting, setIsForgotting] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    // try {
    //   const { data } = await axios.post('api/auth/forgotpassword', { email: email, });
    //   console.log(data);
    // } catch (err) {
    //     console.log('err ---> ', err);
    // }
    setIsForgotting(true);
    try{
    const data : any =  await newForgetPassword(email);
      if(data.error){
        toast.error(data.message);
      }else{
        toast.success(data.message);
      }
    }catch(err: any){
      toast.error(err.message);
    }finally{
      setIsForgotting(false);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center mb-5">
        <Image src="/logo-colored.png" alt="logo" width={200} height={44} />
        <h2 className="mt-5 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Recover password
        </h2>
      </div>

      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          action="#"
          method="POST"
        >
          <div>
            <label className="block text-sm/6 font-medium text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 py-3 px-5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              {isForgetting ? "Sending Link" : "Forgot Password"}
            </button>
          </div>
          <div className="mt-2 text-center">
            <Link href="/sign-in">Return to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
