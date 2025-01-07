"use client";
import Image from "next/image";
import Link from "next/link";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/project",
        visible: ["admin", "teacher", "student", "parent"],
      },

      // {
      //   icon: "/exam.png",
      //   label: "Search",
      //   href: "/list/exams",
      //   visible: ["admin", "teacher", "student", "parent"],
      // },
      {
        icon: "/assignment.png",
        label: "Projects",
        href: "/project",
        visible: ["admin", "teacher", "student", "parent"],
      },
      // {
      //   icon: "/attendance.png",
      //   label: "Task",
      //   href: "/task",
      //   visible: ["admin", "teacher", "student", "parent"],
      // },
      // {
      //   icon: "/attendance.png",
      //   label: "Attendance",
      //   href: "/list/attendance",
      //   visible: ["admin", "teacher", "student", "parent"],
      // },
      // {
      //   icon: "/calendar.png",
      //   label: "Events",
      //   href: "/list/events",
      //   visible: ["admin", "teacher", "student", "parent"],
      // },
      // {
      //   icon: "/message.png",
      //   label: "Messages",
      //   href: "/list/messages",
      //   visible: ["admin", "teacher", "student", "parent"],
      // },
    ],
  },
  {
    title: "OTHER",
    items: [
      
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];


const Menu = () => {
  const logoutFunc = () => {
    // localStorage.removeItem("loginData");
    // localStorage.removeItem("projectsData");
    // localStorage.removeItem("projectsDataSelected");
    // localStorage.removeItem("teamMemberData");
    localStorage.clear();

    document.cookie = `${"access_token"}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    window.location.href="/sign-in"
  };
  return (
    <div className="flex flex-col mt-[30px] text-sm gap-2">
      {menuItems.map((i,indexKey) => (
        <div className="flex flex-col gap-2" key={indexKey}>
          {i.items.map((item, key) => {
            const isLogout = item.label.toLowerCase() === "logout";
            return isLogout ? (
              <div key={key}>
                <div
                  onClick={logoutFunc}
                  // href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-white py-2 cursor-pointer"
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </div>
              </div>
            ) : (
              <div key={key}>
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-white py-2"
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
