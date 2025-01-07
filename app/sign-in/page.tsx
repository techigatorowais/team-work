"use client";

import { loginSuccess } from "@/lib/redux/features/authSlice";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Suspense } from "react";
import { tgcrm } from "../../utils/const";
const LoginPage = () => {
  const router = useRouter();
  // const searchParams = useSearchParams(); // Client-side hook

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     // Ensure code only runs on the client
  //     const urlToken = searchParams?.get("token") || null;
  //     setToken(urlToken);
  //   }
  // }, [searchParams]);

  // useEffect(() => {
  //   if (token) {
  //     LoginWithToken(token);
  //   }
  // }, [token]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setIsSigning(true);
    try {
      const apiUrl = `${tgcrm}api/login`;
      const { data } = await axios.post(apiUrl, { email, password });
      const token = data?.access_token;

      if (token) {
        document.cookie = `access_token=${token}; path=/; max-age=604800; secure`;
        window.localStorage.setItem("loginData", JSON.stringify(data));
        dispatch(loginSuccess({ user: data }));
        toast.success("Login successful");
        router.push("/project");
      } else {
        console.error("Token not found in response");
        toast.error("In-valid email/password");
      }
    } catch (err: any) {
      console.log("Error:", err.message);
      toast.error("In-valid email/password");
    } finally {
      setIsSigning(false);
    }
  };

  const LoginWithToken = async (token: string) => {
    if (!token) return;

    setIsSigning(true);
    try {
      const response = await axios.get(`api/auth/sign-in?token=${token}`);
      const responseData = response.data["response"];
      responseData.access_token = token;
      responseData.token_type = "Bearer";

      if (response.data["type"] !== "client") {
        window.localStorage.setItem("loginData", JSON.stringify(responseData));
        dispatch(loginSuccess({ user: responseData }));
        router.push(`/project`);
      }
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <Suspense>
      <div className="flex h-screen flex-col items-center justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center mb-5">
          <Image src="/logo-colored.png" alt="logo" width={200} height={44} />
          <h2 className="mt-5 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="/forgotpassword"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 py-3 px-5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                {isSigning ? "Loading..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Suspense>
  );
};

export default LoginPage;
