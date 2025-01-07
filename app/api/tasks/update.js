import query from "../../../lib/db";

const UpdateTask = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    let currentTaskData = req.body;
    let timenow = new Date().toISOString()
    
    try{
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let currentTaskQuery = `
        UPDATE tasks 
        SET
            project_id = '${currentTaskData.project_id}', 
            card_id = '${currentTaskData.card_id}', 
            created_by = '${currentTaskData.created_by}',
            updated_by = '${currentTaskData.updated_by}',
            title = '${currentTaskData.title}', 
            description = '${currentTaskData.description}', 
            proiority = '${currentTaskData.proiority}', 
            tags = '${currentTaskData.tags ? JSON.stringify(currentTaskData.tags) : null}', 
            progress = ${currentTaskData.progress}, 
            task_stage = '${currentTaskData.task_stage}', 
            assign_to = '${currentTaskData.assign_to}', 
            due_date = '${currentTaskData.task_date_due}',
            last_updated = '${timenow}'
        WHERE id = '${currentTaskData.task_id}';
    `;
    


        await query(currentTaskQuery);

        let deleteAssignProjectQuery = `DELETE FROM assign_projects WHERE project_id = ${currentTaskData.project_id}`
        await query(deleteAssignProjectQuery);

        const values = currentTaskData.teamMembers.map(member => 
            `(${currentTaskData.project_id}, ${member.team_key}, ${member.id})`
          ).join(", ");

        let assignProjectQuery = `INSERT INTO assign_projects (project_id, team_key, user_id) VALUES ${values};`;
        await query(assignProjectQuery);

        return res.status(201).json({
            success: true,
            message: "task updated successfully",
            response: currentTaskData,
          });
    }catch(error){
        console.error("Error updating task:", error);
        return res.status(400).json({ success: false, message: "Failed to update task", error: error.message });
    }

}


export default UpdateTask;