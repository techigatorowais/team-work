// components/TagDropdown.js
import { postData } from '@/utils/api';
import { AddTaskActivity } from '@/utils/common';
import { useEffect, useRef, useState } from 'react';
import { IoIosAdd } from "react-icons/io";
import { useSelector } from 'react-redux';

const TagDropdown = ({taskTags, tagList, project_id, taskId, refetchTaskActivity} : any) => {
  // const allTags = ['JavaScript', 'React', 'Next.js', 'CSS', 'HTML', 'Node.js', 'Vue', 'Angular'];
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const selectTagRefs = useRef<(HTMLDivElement | string)[]>([]);

  const user = useSelector((state: any) => state.auth.user);

  // Filter tags based on search input
  const filteredTags = tagList.filter((tag : any) => 
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle selection of tags
  const toggleTagSelection = (tag : any) => {
    setSelectedTags((prevTags: any) =>
      prevTags.some((t: any) => t.id === tag.id)
        ? prevTags.filter((t : any) => t.id !== tag.id)
        : [...prevTags, tag]
    );
  };

  let tempTags: any = [];

  // Handle search input change
  const handleSearchChange = (e: any) => {
    setSearchQuery(e.target.value);
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(prevState => !prevState);
  };


  const UpdateTaskTags = async () => {
    try{
      const {data} = await postData('api/tasks/tags/add',{
        task_id: taskId,
        tagList: selectTagRefs?.current
      })

      const addedTagNames = selectTagRefs.current.map((tag: any) => tag.name);

      let activityMsg = selectTagRefs?.current?.length > 0 ? 'Updated the tasks tags [ ' + addedTagNames.join(', ') + ' ]' : "Removed the tags";
      AddTaskActivity(refetchTaskActivity,{
        user_id: user?.id,
        task_id:taskId,
        project_id:project_id,
        activity: activityMsg,
        activity_type: 1
      })
    }catch(error){

    }
  }


  useEffect(() => {
    selectTagRefs.current = selectedTags;
  },[selectedTags])

  useEffect(() => {
    setSelectedTags(taskTags);
  },[])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          UpdateTaskTags()
          setIsOpen(false);
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
}, []);


  return (
    <div className="relative w-1/3 flex-grow">
      {/* Dropdown Trigger */}
      <label className='block text-sm font-semibold text-ColorDark mb-3'>{selectedTags.length === 0 ? 'Tags' : 'Select more tags'}</label>
      <button 
        onClick={toggleDropdown}
        className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
      >
        <IoIosAdd className='text-lg' />
        
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 bg-white border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto shadow-lg w-[240px]" ref={dropdownRef}>
          {/* Search Bar */}
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search tags..."
            className="py-[8px] px-2 mb-2 text-sm border-0 rounded-md text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus-visible:none w-full"
          />

          {/* Tag List */}
          <div>
            {filteredTags.map((tag: any) => (
              <div
                key={tag.id}
                onClick={() => toggleTagSelection(tag)}
                className={`cursor-pointer p-2 rounded-md mb-1 text-sm ${
                  selectedTags.includes(tag) ? 'bg-blue-200' : 'bg-gray-100'
                } hover:bg-gray-200`}
              >
                {tag.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Tags Area */}
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedTags.map((tag: any) => (
          <span key={tag.id} className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm">
            {tag.name}
            <button
              onClick={() => toggleTagSelection(tag)}
              className="ml-2 text-blue-500"
            >
              &times;
            </button>
          </span>
        ))}
      </div>

    </div>
  );
};

export default TagDropdown;
