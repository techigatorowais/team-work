import query from "../../../../lib/db";

const GetTaskTags = async (req, res) => {
    try{
        let taskTags = await query(`
          SELECT * FROM tasks_tags where status = 1
        `
        )

        if(taskTags.length == 0){
            return res.status(200).json({
                success: true,
                message: "No taskTags found.",
                response: taskTags,
        })      
        }

        return res.status(201).json({
          success: true,
          message: "taskTags fetched successfully",
          response: taskTags,
        });

        
  }catch(error){
      console.error("Error fetching taskTags:", error);
      return res.status(400).json({ success: false, message: "Failed to fetch taskTags", error: error.message });
  }

}


export default GetTaskTags;