import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// const inter = Inter({ subsets: ["latin"] });

//👇 Import Open Sans font
import { Open_Sans } from "next/font/google";

//👇 Configure our font object
const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "My Teamwrk",
  description: "My Teamwrk",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {


  return (
    <html lang="en">
      {/* <link rel="icon" href="/fav.jpg" sizes="any" /> */}
     

      <body className={openSans.className} >
        <StoreProvider>
          <ToastContainer position={"bottom-right"}  />
          <main>{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
