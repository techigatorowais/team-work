'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { Suspense, useEffect, useState } from 'react'
import axios from "axios";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import {tgcrm} from '../../utils/const'
const ResetPassword = () => {

    const router = useRouter();

    const [email, setEmail] = useState<string | null>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [resetToken, setResetToken] = useState<string | null>('');

    const [isResetting, setIsResetting] = useState(false);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if(!password || !confirmPassword){
            toast.error("Enter password");
            return;
        }

        if(password !== confirmPassword){
            toast.error("Password does not match");
            return;
        }

        setIsResetting(true);

        let bakedData = {
            email: email,
            password: password,
            password_confirmation: confirmPassword,
            token: resetToken
          }
        try {
          
          const { data } = await axios.post(`${tgcrm}api/reset-password`,bakedData);

          toast.success("Password Successfully Reset.");
          router.push(`/sign-in`);
        } catch (err: any) {
            console.log('err ---> ', err);
            toast.error("In-valid email/password")
        }finally{
            setIsResetting(false);
        }
      }

      
      useEffect(() => {
        if (typeof window !== "undefined") {
          // Ensure code only runs on the client
          const urlSearchParams = new URLSearchParams(window.location.search);
          const urlToken = urlSearchParams.get("token") || null;
          const urlEmail = urlSearchParams.get("email") || null;
    
          // Redirect to sign-in if token or email is missing
          if (!urlToken || !urlEmail) {
            router.push(`/sign-in`);
            return; // Prevent further execution
          }
    
          setEmail(urlEmail);
          setResetToken(urlToken);
        }
      }, [router]);

  return (
    <Suspense>
    <div className="flex h-screen flex-col items-center justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center mb-5">
                <Image src="/logo-colored.png" alt="logo" width={200} height={44} />
                <h2 className="mt-5 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Reset password</h2>
            </div>

            <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-6" action="#" method="POST">
                    <div>
                        <label className="block text-sm/6 font-medium text-gray-900">New Password</label>
                        <div className="mt-2">
                            <input id="password" name="password" type="password"  
                             value={password}
                             onChange={(e) => setPassword(e.target.value)}
                            className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm/6"/>
                        </div>
                        <label className="block text-sm/6 font-medium text-gray-900 mt-2">Confirm Password</label>
                        <div className="mt-2">
                            <input id="confirmPassword" name="confirmPassword" type="password"  
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm/6"/>
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 py-3 px-5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500">{isResetting ? "Resetting" : "Reset"}</button>
                    </div>
                </form>
                
            </div>
        </div>
    </Suspense>
  )
}

export default ResetPassword
