import React, { useState } from "react";

const CustomCheckbox = ({ checked, OnUpdate, isCompleted, task, cx=13, cy=14, d="M18 11l-7 6-3-3"  }: any) => {
  const [taskCompleted, setTaskCompleted] = useState(checked);
  const SetTaskStatus = () => {
    setTaskCompleted((prevState: any) => !prevState);
    OnUpdate(task);
  }
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={taskCompleted}
        onChange={SetTaskStatus}
        className="sr-only peer"
      />
           <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center peer-checked:border-gray-500 peer-checked:bg-green-500 ${taskCompleted ? 'bg-green-500 border-green-600' : 'bg-transparent'}`}>
        {taskCompleted ? 
            // Green 
            <svg className="w-5 h-5 flex-none" fill="none" viewBox="0 0 27 28" stroke="#000" strokeWidth="0"><circle cx={cx} cy={cy} r="9" fill="none"></circle><path d={d} stroke="#fff" strokeWidth="2"></path></svg>
        : 
            // Transparent 
            <svg className="w-5 h-5 flex-none" fill="none" viewBox="0 0 24 24" stroke="#626161" strokeWidth="1"><circle cx={cx} cy={cy} r="9" fill="#fff"></circle><path d={d} stroke="#464646" strokeWidth="1"></path></svg>
        }
        
      </div>
    </label>
  );
};


export default CustomCheckbox;
