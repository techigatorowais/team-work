"use client"

import Image from 'next/image';
import { useState } from 'react';

// TEMPOPRARY 
const events = [
    {
    id: 1,
        title: "Lorem Ipsum dolor",
        time: "12:00 PM - 2:00 PM",
        description: "Lorem Ipsum dolor sit amet, Lorem Ipsum dolor sit amet.",
    },
    {
    id: 2,
        title: "Lorem Ipsum dolor",
        time: "12:00 PM - 2:00 PM",
        description: "Lorem Ipsum dolor sit amet, Lorem Ipsum dolor sit amet.",
    },
    {
    id: 3,
        title: "Lorem Ipsum dolor",
        time: "12:00 PM - 2:00 PM",
        description: "Lorem Ipsum dolor sit amet, Lorem Ipsum dolor sit amet.",
    },
]

const Announcements = () => {
    
    return (
        <div className="bg-white rounded-md p-4">
            
            <div className='flex items-center justify-between'>
                <h1 className='text-xl font-semibold'>Announcements</h1>
                <span className='text-xs text-gray-400'>View All</span>
            </div>
            <div className='flex flex-col gap-4 mt-4'>
                <div className='bg-lamaSkyLight rounded-md p-4'>
                    <div className='flex items-center justify-between'>
                        <h2 className='font-medium'>Lorem ipsum dolor sit</h2>
                        <span className='text-xs text-gray-400 bg-white rounded-md px-1 py-1'>
                            2025-01-01
                        </span>
                        
                    </div>
                    <p className='text-sm text-gray-400 mt-1'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nisi labore dignissimos recusandae.</p>
                </div>
                <div className='bg-lamaPurpleLight rounded-md p-4'>
                    <div className='flex items-center justify-between'>
                        <h2 className='font-medium'>Lorem ipsum dolor sit</h2>
                        <span className='text-xs text-gray-400 bg-white rounded-md px-1 py-1'>
                            2025-01-01
                        </span>
                        
                    </div>
                    <p className='text-sm text-gray-400 mt-1'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nisi labore dignissimos recusandae.</p>
                </div>
                <div className='bg-lamaYellowLight rounded-md p-4'>
                    <div className='flex items-center justify-between'>
                        <h2 className='font-medium'>Lorem ipsum dolor sit</h2>
                        <span className='text-xs text-gray-400 bg-white rounded-md px-1 py-1'>
                            2025-01-01
                        </span>
                        
                    </div>
                    <p className='text-sm text-gray-400 mt-1'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nisi labore dignissimos recusandae.</p>
                </div>
            </div>
        </div>
    )
}

export default Announcements