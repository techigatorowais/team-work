import query from "../../../../lib/db";

const AddTaskTags = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    
    let {tagList, task_id} = req.body;

    try{
        let deleteTaskAssignTags = `DELETE FROM assign_tasks_tags WHERE task_id = ${task_id}`
        await query(deleteTaskAssignTags);


        if(tagList.length > 0){
        const values = tagList.map(tag => 
            `(${task_id}, ${tag.id})`
          ).join(", ");

        let assignTaskTagsQuery = `INSERT INTO assign_tasks_tags  (task_id, tag_id) VALUES ${values};`;
        await query(assignTaskTagsQuery);

        if(assignTaskTagsQuery.affectedRows > 0){
            return res.status(201).json({
                success: true,
                message: "task tags assigned",
                response: tagList,
              });
        }else{
            return res.status(200).json({
                success: true,
                message: "no task tags assigned",
                response: null,
              });
        }
        
        }else{
            return res.status(200).json({
                success: true,
                message: "no task tags assigned",
                response: null,
              });
        }

    }catch(error){
        console.error("Error adding tags in task", error);
        return res.status(400).json({ success: false, message: "Failed adding tags in task", error: error.message });
    }


}


export default AddTaskTags;
