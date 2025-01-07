"use client"

import React,{useEffect, useState} from "react";
import Image from "next/image"
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
   
    const pathname = usePathname();
    const auth = useSelector((state: any) => state.auth.user);
    const selectedProject = useSelector((state: any) => state.projects.selectedProject);
    const projects = useSelector((state: any) => state.projects?.projects);
    const projectTasks = useSelector((state: any) => state.projects?.projectTasks);

    const dispatch = useDispatch();
  // Function to check if the link is active
  const isActive = (path: string): boolean => pathname === path;

    const [userName, setName]  = useState('');
    const [userType, setUserType]  = useState('');
    const [counts, setCounts] = useState({createdToday: 0, late: 0 });

    useEffect(() =>{

        setName(auth?.name?.trim());
        setUserType(auth?.type?.trim());
    },[])

    useEffect(() => {
        if(!projects) return;

        console.log('projects----> ',projects);
        setCounts(projects?.reduce(
            (acc : any, project: any) => {
              const projectCreatedDate = getDateOnly(project.created_at);
              const projectDueDate = getDateOnly(project.project_date_due);
          
              if (projectCreatedDate === today) {
                acc.createdToday++;
              }else if (projectDueDate < today) {
                acc.late++;
              }
          
              return acc;
            },
            { createdToday: 0, late: 0 } // Initial accumulator object
          ));
    },[projects])


    
    const getDateOnly = (dateString: string) => {
        // Return the date part only (ignoring time)
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };
    const today = getDateOnly(new Date().toISOString());

    // const counts = { createdToday: 0, late: 0 }
    
    const renderStats = () => {
        if (pathname === '/project') {
          // When we're at /project route
          
          return (
            <div className="flex space-x-4 items-center bg-gray-100 px-4 py-2 rounded-lg">
            <span className="flex items-center text-xs space-x-2">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 9l6 6 6-6"
                />
                </svg>
                <span>My Projects {"( "+ (projects?.length || 0) +" )"}</span>
            </span>
            <span className="text-red-500 text-xs">{counts?.late} Late</span>
            <span className="text-blue-500 text-xs">{counts?.createdToday} Today</span>
            </div>
          );
        }
    
        if (pathname?.startsWith('/project/')) {
          // When we're at a dynamic route like /project/[dynamic name]
          return (
            <div className="flex space-x-4 items-center bg-gray-100 px-4 py-2 rounded-lg">
            <span className="flex items-center text-xs space-x-2">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 9l6 6 6-6"
                />
                </svg>
                <span>My tasks {"( "+(projectTasks?.pendingTasks.length+ projectTasks?.completedTasks.length) +" )"}</span>
            </span>
            <span className="text-red-500 text-xs">{projectTasks?.pendingTasks.length} In-Complete</span>
            <span className="text-blue-500 text-xs">{projectTasks?.completedTasks.length} Completed</span>
            </div>
          );
        }
    }

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between p-4">
                {/* ICONS AND USERS */}
                <div className="flex items-center gap-6 justify-end w-full">
                    {/* <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
                        <Image src="/message.png" alt="" width={20} height={20} />
                    </div> */}
                    {/* <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
                        <Image src="/announcement.png" alt="" width={20} height={20} />
                        <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">1</div>
                    </div> */}
                    <div className="flex flex-col">
                        <span className="text-xs leading-3 font-medium">{userName}</span>
                        <span className="text-[10px] text-gray-600 text-right">{userType}</span>
                    </div>
                    <Image src='/avatar.png' alt="" width={36} height={36} className="rounded-full" />
                </div>
            </div>
            {/* NAVBAR  */}
            <div className="bg-white shadow-sm px-6 py-3 flex items-center justify-between">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 w-2/5">
                    <span className="text-gray-600">Home</span>
                    <span className="text-gray-300">/</span>
                    <span className="text-ColorDark font-semibold line-clamp-1" title={selectedProject ? selectedProject.project_title : null}>{selectedProject ? selectedProject.project_title : null}</span>
                </div>

                {/* Links */}
                <div className="flex space-x-6 items-center">
                    <nav className="flex space-x-4 text-sm font-medium">
                        <Link  href="/project"
                            className={`${
                            isActive("/project")
                                ? "text-black border-b-2 border-blue-500"
                                : "text-gray-600 hover:text-black"
                            }`}
                            >My Projects</Link>
                        {/* <Link href="/task" className="text-gray-600 hover:text-black">My Task</Link>
                        <Link href="/" className="text-gray-600 hover:text-black">Activity</Link>
                        <Link href="/" className="text-gray-600 hover:text-black relative">
                            Inbox
                            <span className="absolute top-0 right-0 transform translate-x-2 -translate-y-1 bg-blue-500 text-white text-xs rounded-full px-1">
                            9
                            </span>
                        </Link> */}
                        
                        <Link href="#" className={`${
                            isActive("/admin")
                                ? "text-black border-b-2 border-blue-500"
                                : "text-gray-600 hover:text-black"
                            }`}
                            >Dashboards
                        </Link>
                    </nav>

                    {/* Summary Info */}
                    {renderStats()}
                </div>

            </div>
        </div>
    )
    
}

export default Navbar;