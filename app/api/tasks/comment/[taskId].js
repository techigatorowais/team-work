import query from "../../../../lib/db";

const GetTasksComments = async (req, res) => {

    const {taskId} = req.query;
    try{
        let taskComments = await query(`
          SELECT 
            tmc.id, 
            tmc.user_id,
            u.name,
            tmc.project_id, 
            tmc.task_id, 
            tmc.comment, 
            tmc.attachment_url, 
            tmc.type,
            tmc.created_at, 
            tmc.updated_at, 
            tmc.deleted_at, 
            tmc.status
        FROM 
        tm_comments as tmc
        JOIN users AS u ON u.id = tmc.user_id
        WHERE tmc.task_id = ${taskId}  AND tmc.status = 1
        `
        )

        if(taskComments.length == 0){
            return res.status(200).json({
                success: true,
                message: "No taskComments found.",
                response: taskComments,
        })      
        }

        return res.status(201).json({
          success: true,
          message: "task Comments fetched successfully",
          response: taskComments,
        });

        
  }catch(error){
      console.error("Error fetching task Comments:", error);
      return res.status(400).json({ success: false, message: "Failed to fetch task Comments", error: error.message });
  }

}


export default GetTasksComments;