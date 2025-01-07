import query from '../../../../lib/db';

const GetTaskDetails = async (req, res) => {

    const {taskId} = req.query;
    try{
        let tasks = await query(`
          SELECT t.id, t.project_id, t.card_id, t.title, t.proiority, t.description, t.assign_to, t.due_date, t.created_at FROM tasks AS t  WHERE t.id = ${taskId}
        `
        )

        if(tasks.length == 0){
            return res.status(200).json({
                success: true,
                message: "No tasks found.",
                response: tasks,
        })      
        }

        return res.status(201).json({
          success: true,
          message: "tasks fetched successfully",
          response: tasks,
        });

        
  }catch(error){
      console.error("Error fetching tasks:", error);
      return res.status(400).json({ success: false, message: "Failed to fetch tasks", error: error.message });
  }

}


export default GetTaskDetails;