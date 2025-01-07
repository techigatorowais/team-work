import { CalculateInitials } from '@/utils/common';
import React from 'react';
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const badges = ['#FACC15','#F472B6']

const BadgeGroup = ({ teamMembers, extraCount, minimumVisible = 2}: any) => {
  return (
    <div className="flex items-center space-x-[-10px]">
      {teamMembers?.slice(0, minimumVisible).map((member: any, index: any) => (
        // <div
        //   key={index}
        //   className="w-8 h-8 rounded-full flex items-center justify-center text-white font-normal"
        //   style={{ backgroundColor: badges[index % badges.length] }}
        // >
        //   {CalculateInitials(member.name)}
        //   <Tooltip
        //     anchorSelect={`#tooltipName-${member.id}`}
        //     content={member?.name}
        //   />
        // </div>
        <div key={index}>
          <div
            id={`tooltipName-${member.id}`}
            className={`m-0 h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-medium`}
            style={{
              backgroundColor: badges[index % badges.length],
            }}
          >
            {CalculateInitials(member.name)}
          </div>
          <Tooltip
            anchorSelect={`#tooltipName-${member.id}`}
            content={member?.name}
          />
        </div>
      ))}
      {extraCount > minimumVisible && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-normal bg-black text-[12px]">
          +{extraCount - minimumVisible}
        </div>
      )}
      
    </div>
  );
};

export default BadgeGroup;
