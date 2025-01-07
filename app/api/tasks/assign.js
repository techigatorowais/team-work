import query from "../../../lib/db";

const AssignTask = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    let {teamMembers, task_id, project_id} = req.body;
    try{


        if(teamMembers.length > 0){
            const values = teamMembers.map(member => 
                `(${project_id}, ${member.team_key}, ${task_id}, ${member.id})`
            ).join(", ");

            let newTaskAssignQuery = `INSERT INTO assign_projects_tasks (project_id, team_key, task_id, user_id) VALUES ${values};`;
            let newTaskAssignData = await query(newTaskAssignQuery);

            return res.status(201).json({
                success: true,
                message: "task assigned successfully",
                response: newTaskAssignQuery,
            });
        }else{
            return res.status(201).json({
                success: true,
                message: "task created successfully",
                response: {task_id},
            });
        }
    }catch(error){
        console.error("Error assgining task:", error);
        return res.status(400).json({ success: false, message: "Failed to assign task", error: error.message });
    }

}


export default AssignTask;
