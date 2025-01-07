// components/StageDropdown.js
import { fetchDataWithOutParam, postData } from "@/utils/api";
import { AddTaskActivity } from "@/utils/common";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

interface StageDropdownProps {
  taskId: string;
  project_id: string;
  refetchTaskActivity: () => void;
}

const StageDropdown = ({ taskId, project_id, refetchTaskActivity }: StageDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false); // Manage dropdown visibility
  const [selectedStage, setSelectedStage] = useState<string | null>(null); // Store selected stage
  const [searchQuery, setSearchQuery] = useState(""); // Filter query for search bar
  const [stages, setStages] = useState([]); // Store stages
  const dropdownRef = useRef<HTMLDivElement | null>(null); // Ref for dropdown

  // Get user data from Redux
  const user = useSelector((state: any) => state.auth.user);

  // Filter stages based on the search query
  const filteredStages = stages.filter((stage: any) =>
    stage.stage_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch stage records
  const fetchRecords = async () => {
    try {
      const { data } = await fetchDataWithOutParam(`api/tasks/stages/get`);
      setStages(data["response"]);
      console.log("fetchRecords", data["response"]);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  // Update stage and log activity
  const updateStage = async (stage: any) => {
    const data = {
      id: taskId,
      task_stage: stage.id,
    };

    console.log("updateStage", data);
    const response = await postData("/api/tasks/stages/update", data);

    AddTaskActivity(refetchTaskActivity, {
      user_id: user?.id,
      task_id: taskId,
      project_id: project_id,
      activity: "Marked the task as " + stage.stage_name,
      activity_type: 1,
    });

    console.log("updateStage", response);
  };

  // Handle stage selection
  const handleSelect = (stage: any) => {
    setSelectedStage(stage.stage_name);
    updateStage(stage);
    setIsOpen(false); // Close the dropdown after selection
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    fetchRecords();

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-1/3 flex-grow" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-ColorDark mb-3">
        Status
      </label>
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center text-sm text-gray-400"
      >
        {selectedStage || "Backlog"}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 bg-white border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto shadow-lg w-[240px]">
          <input
            type="text"
            className="py-[8px] px-2 text-sm border-0 rounded-md text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus-visible:none w-full"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <ul className="max-h-60 overflow-y-auto">
            {filteredStages.length === 0 ? (
              <li className="p-2 text-sm text-gray-600">No stages found</li>
            ) : (
              filteredStages.map((stage: any, index) => (
                <li
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-200 text-sm text-gray-600"
                  onClick={() => handleSelect(stage)}
                >
                  {stage.stage_name}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StageDropdown;
