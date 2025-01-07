import query from "../../../lib/db";

const TaskStatus = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    let {taskStatusData} = req.body;
    
    try{
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let currentTaskQuery = `
        UPDATE tasks 
        SET
            completed = '${taskStatusData.completed}', 
            updated_at = '${timestamp}'
        WHERE id = '${taskStatusData.task_id}';
    `;
    

        let taskStatusQuery = await query(currentTaskQuery);
        if(taskStatusQuery.affectedRows > 0){
        return res.status(201).json({
            success: true,
            message: "task status updated successfully",
            response: taskStatusData,
          });
        }
    }catch(error){
        console.error("Error updating task:", error);
        return res.status(400).json({ success: false, message: "Failed to update task", error: error.message });
    }

}


export default TaskStatus;