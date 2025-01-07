import React, { useState, useMemo, useEffect, useRef } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { CiCircleRemove } from "react-icons/ci";
import { User } from "@/interface";
import { useDispatch } from "react-redux";
import { UpdateTeamMembers } from "@/lib/redux/features/teamMemberSlice";
import { IoIosAdd } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { CalculateInitials, GetDefaultColor } from "@/utils/common";
import BadgeGroup from "./BadgeGroup";

const MultiUserDropdown = ({
  teamUserList,
  assignMembers,
  onChangeAssignee = null,
}: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [taskMembers, setTaskMembers] = useState<User[]>(
    assignMembers == null ? [] : assignMembers
  );
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  // const [members, setMembers] = useState<User[]>([
  //   { id: '2', name: 'Default User', initials: 'DU', color: 'bg-gray-500' },
  //   { id: '3', name: 'Lutfi Ahmed', initials: 'LA', color: 'bg-orange-500' },
  //   { id: '4', name: 'Mujahid Khan', initials: 'MK', color: 'bg-yellow-500' },
  // ]);
  const [members, setMembers] = useState<User[]>(teamUserList);
  const dispatch = useDispatch();

  // Filtered members list based on search
  const filteredMembers = useMemo(() => {
    return members?.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [members, searchTerm]);

  // const filteredMembers =  members?.filter((user) =>
  //     user.name.toLowerCase().includes(searchTerm.toLowerCase())
  //   );

  // Handle adding/removing members
  const handleAddToTask = (user: User) => {
    if (taskMembers) {
      setTaskMembers([...taskMembers, user]);
      setMembers(members?.filter((member) => member.id !== user.id));

      if (onChangeAssignee != null) {
        onChangeAssignee({ name: user.name, message: "added" });
      }
    }
  };

  const handleRemoveFromTask = (user: User) => {
    if (taskMembers) {
      setMembers([...members, user]);
      setTaskMembers(taskMembers.filter((member) => member.id !== user.id));
      onChangeAssignee({ name: user.name, message: "removed" });
    }
  };

  useEffect(() => {
    if (assignMembers != null) {
      const filteredTeamMembers = members?.filter(
        (member) =>
          !assignMembers.some((remove: any) => remove.id === member.id)
      );
      setMembers(filteredTeamMembers);
    }
  }, []);

  useEffect(() => {
    dispatch(UpdateTeamMembers({ newTeamMember: taskMembers }));
  }, [taskMembers]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const OpenDropDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);
  };

  let minimumVisibleMembers = 5;
  return (
    <div className="relative">
      {/* Trigger Button */}
      <div className="flex items-center flex-wrap gap-1">
        {/* Task Member Avatars */}
        {
          // taskMembers ? taskMembers.map((user) => (
          //   <div
          //     key={user.id}
          //     className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${GetDefaultColor(user.color)}`}
          //   >
          //     {/* {user.initials} */}
          //     {CalculateInitials(user.name)}
          //   </div>
          // )): null

          <BadgeGroup
            minimumVisible={minimumVisibleMembers}
            teamMembers={taskMembers}
            extraCount={taskMembers.length}
          />
        }
        {/* Plus Icon */}
        {/* <button
          onClick={(e) => OpenDropDown(e)}
          className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
        >
          <IoIosAdd className="text-lg" />
        </button> */}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute top-12 left-0 w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-10"
          ref={dropdownRef}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Team Members</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoClose className="text-lg" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4">
            <input
              type="text"
              placeholder="Search members"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Content with Scroll */}
          <div className="p-4 overflow-y-auto max-h-64">
            {/* Project Members */}
            {taskMembers
              ? taskMembers.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">
                      Project Members
                    </h4>
                    {taskMembers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${GetDefaultColor(
                              user.color
                            )}`}
                          >
                            {/* {user.initials} */}
                            {CalculateInitials(user.name)}
                          </div>
                          <span className="text-sm">{user.name}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveFromTask(user)}
                          className="text-red-500 font-bold hover:text-red-700 text-2xl"
                        >
                          <CiCircleRemove />
                        </button>
                      </div>
                    ))}
                  </div>
                )
              : null}

            {/* Members */}
            <div>
              <h4 className="text-sm font-semibold text-gray-600 mb-2">
                Members
              </h4>
              {filteredMembers?.length > 0 ? (
                filteredMembers?.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleAddToTask(user)}
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${GetDefaultColor(
                          user.color
                        )}`}
                      >
                        {/* {user.initials} */}
                        {CalculateInitials(user.name)}
                      </div>
                      <span className="text-sm">{user.name}</span>
                    </div>
                    <button className="text-gray-500 hover:text-gray-700 text-2xl">
                      <IoIosAddCircleOutline />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No members found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiUserDropdown;
