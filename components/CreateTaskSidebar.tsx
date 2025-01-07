import { useEffect, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import MultiUserDropdown from './MultiUserDropdown';
import DropzoneComponent from './DropzoneComponent';
import { UpdateTeamMembers } from '@/lib/redux/features/teamMemberSlice';
import { FormatDate } from '@/utils/common';
import { toast } from 'react-toastify';
import * as Yup from "yup";

export default function CreateTaskSidebar({addProjectTask, isCreating, isCreated, isOpen, onClose,  project_id, assignMembers}:{addProjectTask: any, isCreating:any, isCreated:any, isOpen:any, onClose:any, project_id: any, assignMembers: any | null}) {

    const teamMemberList = useSelector((state: any) => state.teamMembers.teamMembers);
    const selectedTeamMembers = useSelector((state: any) => state.teamMembers.selectedTeamMembers);
    const user = useSelector((state: any) => state.auth.user);


    const formatDate = (date: any) => {
      return date.toISOString().split("T")[0];
    };

    const [formData, setFormData] = useState(() => {
      const currentDate = new Date(); // Current date
      const dueDate = new Date(); // Clone current date
      dueDate.setDate(currentDate.getDate() + 7); // Add 7 days for due date
    
      return {
        project_id: project_id,
        card_id: 1,
        created_by: user.id || 0,
        title: "",
        description: "",
        proiority: 1,
        tags: null,
        progress: 0,
        task_stage: 1,
        teamMembers: [],
        task_date_start: FormatDate(currentDate), // Default to today's date
        task_date_due: FormatDate(dueDate), // Default to one week later
        updated_by: user.id || 0
      };
    });
    
    const [assign_to, setAssign_to] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const [error, setError] = useState('')

    const dispatch = useDispatch();

   
    const validationSchema = Yup.object({
      title: Yup.string()
        .required("Title is required")
        .min(3, "Title must be at least 3 characters")
        .max(220, "Title cannot exceed 220 characters"),
    
      description: Yup.string()
        .notRequired()
        .max(500, "Description cannot exceed 500 characters"),

      teamMembers: Yup.array()
        .min(1, "At least one team member is required")
        .required("Team members are required"),
    
      task_date_start: Yup.date()
        .required("Start date is required")
        .max(new Date(), "Start date cannot be in the future")
        .typeError("Start date must be a valid date"),
    
      task_date_due: Yup.date()
        .required("Due date is required")
        .min(Yup.ref('task_date_start'), "Due date must be after the start date")
        .typeError("Due date must be a valid date"),
    });
    


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };


    const handleDropDownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFormData({...formData, proiority: parseInt(e.target.value)})
    };


    const InitiateTask = async (e: React.FormEvent) => {
      e.preventDefault();

      if(isAdding) return;

    setIsAdding(true);

    let validateSuccess = false;

      try {
        await validationSchema.validate(formData, { abortEarly: false });
        setErrors({});
        validateSuccess = true;

      } catch (err: any) {
        // If validation fails, process the error and update the error state
        if (err.inner) {
          // `err.inner` contains all validation errors
          const errorMessages = err.inner.reduce((acc: any, error: any) => {
            acc[error.path] = error.message;
            return acc;
          }, {});
          setErrors(errorMessages);
          toast.error("Fill required fields*");
          validateSuccess = false;
        }
      }

     
    
    try{
      if(validateSuccess){        
        await addProjectTask(formData);
        toast.success("Task Created");
        setFormData({
          ...formData,
          project_id: project_id,
          card_id: 1,
          created_by: user.id || 0,
          title: "",
          description: "",
          proiority: 1,
          tags: null,
          progress: 0,
          task_stage: 1,
          teamMembers: [],
          task_date_start: FormatDate(new Date()),
          task_date_due: FormatDate(new Date(new Date().setDate(new Date().getDate() + 7))),
          updated_by: user.id || 0
        });
        setAssign_to([]);
        dispatch(
          UpdateTeamMembers({newTeamMember: []})
        )  
        onClose();
      }
      // const { data } = await postData('api/tasks/add',formData);

      // if(data.success = true) {
      //   // const { assignTask } : any = await postData('api/tasks/assign',{
      //   //   task_id: data["response"]["id"],
      //   //   project_id: data["response"]["project_id"],
      //   //   teamMembers: assign_to
      //   // });
      // }
      // alert(data.message);

      // Reset the form after submission (if success)
      
    }catch(err){
      toast.error("Task Not Created");
    }finally{
      setIsAdding(false);
    }
    }

    useEffect(() => {
      setAssign_to(selectedTeamMembers)
      setFormData({...formData,
        teamMembers: selectedTeamMembers
      })
    },[selectedTeamMembers])

    // useEffect(() => {
    //   if(isCreated == true){
    //     console.log("task created closing popup");
    //     onClose();
    //   }else{
    //     console.log("failed to create task, no closing popup");
    //   }
    // },[isCreated])

  if (!isOpen) return null;

  

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-end z-50">
      <div className="xl:w-1/2 w-1/3 bg-white h-full p-6 shadow-lg overflow-y-auto">
        <div className='flex items-center justify-between'>
          <h2 className="text-2xl font-semibold mb-4 flex-grow">Add New Task</h2>
          <button onClick={onClose} className="text-xl font-semibold mb-4 table ml-auto">
              <IoClose />
          </button>
        </div>

        <form onSubmit={InitiateTask} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-ColorDark mb-1">
                    Task Name
                </label> 
                <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Give your task a name"
                className={`w-full border ${ error ? 'border-red-500' : 'border-gray-300' } rounded-md px-3 py-2 text-sm ${ error ? 'focus:ring-red-500' : 'focus:ring-blue-500' } focus:outline-none focus-visible:none`}
            />
            {errors.title && <div style={{ color: "red" , fontSize: "12px" }}>{errors.title}</div>}
            {error && (
            <p className="text-sm text-red-500 mt-1">Please enter a name</p>
            ) }
            </div>
          

          {/* Date Range  */}
            <div className="flex gap-4">
                <div className="flex-grow">
                    <label className="block text-sm font-medium text-ColorDark mb-1">
                    Start Date
                    </label>
                    <input
                    type="date"
                    name="task_date_start"
                    value={formData.task_date_start}
                    onChange={handleChange}
                    placeholder="dd-mm-yy"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus-visible:none"
                    />
                    {errors.task_date_start && <div style={{ color: "red" , fontSize: "12px" }}>{errors.task_date_start}</div>}
                </div>
                <div className="flex-grow">
                    <label className="block text-sm font-medium text-ColorDark mb-1">
                    End Date
                    </label>
                    <input
                    type="date"
                    name="task_date_due"
                    placeholder="dd-mm-yy"
                    value={formData.task_date_due}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus-visible:none"
                    />
                    {errors.task_date_due && <div style={{ color: "red" , fontSize: "12px" }}>{errors.task_date_due}</div>}
                </div>
            </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-ColorDark">
              Priority
            </label>
            <select
              id="priority"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              name="proiority"
              value={formData.proiority}
              onChange={handleDropDownChange}
            >
              <option value="1">Low</option>
              <option value="2">Medium</option>
              <option value="3">High</option>
            </select>
            {errors.proiority && <div style={{ color: "red" , fontSize: "12px" }}>{errors.proiority}</div>}
          </div>

          {/* <div>
            <label htmlFor="tags" className="block text-sm font-medium text-ColorDark">
              Tags
            </label>
            <input
              id="tags"
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              placeholder="Add tags..."
            />
          </div> */}

          {/* <div>
            <label htmlFor="stage" className="block text-sm font-medium text-ColorDark">
              Stage
            </label>
            <select
              id="stage"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              name="task_stage"
              value={formData.task_stage}
              onChange={handleDropDownChange}
            >
              <option value={1}>Not Started</option>
              <option value={2}>In Progress</option>
              <option value={3}>Completed</option>
            </select>
          </div> */}

          <div>
            <label htmlFor="assign-to" className="block text-sm font-medium text-ColorDark mb-1">
              Assign To
            </label>
            {
              teamMemberList ? <MultiUserDropdown teamUserList={teamMemberList} assignMembers={assignMembers} />
              : null
            }
            {errors.teamMembers && <div style={{ color: "red" , fontSize: "12px" }}>{errors.teamMembers}</div>}
          </div>

          <div>
            {/* <DropzoneComponent /> */}
          </div>

          <div className="flex justify-end">
            <button type="submit" className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md">
              {isCreating ? "Creating" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
