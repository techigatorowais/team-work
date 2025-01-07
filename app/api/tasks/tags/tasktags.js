import query from "../../../../lib/db";

const GetTagAgainstTask = async (req, res) => {

      if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const {task_id} = req.body;
    try{
        let taskTags = await query(`
          SELECT tt.id, tt.name, tt.bgColor, tt.nameColor, tt.status FROM tasks_tags AS tt
            JOIN assign_tasks_tags AS att ON tt.id = att.tag_id
            WHERE att.task_id = ${task_id}

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
          message: "task Tags fetched successfully",
          response: taskTags,
        });

        
  }catch(error){
      console.error("Error fetching taskTags:", error);
      return res.status(400).json({ success: false, message: "Failed to fetch taskTags", error: error.message });
  }

}


export default GetTagAgainstTask;