import query from "../../../lib/db";

const AddTask = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    let newTask = req.body;
        
        let timenow = new Date().toISOString()
   
    try{
        // const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let newTaskQuery = `INSERT INTO tasks 
        (
        project_id,
        card_id,
        created_by,
        updated_by,
        title, 
        description, 
        proiority,
        tags,
        progress,
        task_stage,
        assign_to, 
        due_date,
        created_at,
        last_updated
        ) VALUES 
         (
        '${newTask.project_id}', 
        '${newTask.card_id}',
        '${newTask.created_by}', 
        '${newTask.updated_by}', 
        '${newTask.title}', 
        '${newTask.description}', 
        '${newTask.proiority}',
        '${newTask.tags}',
         ${newTask.progress},
        '${newTask.task_stage}',
        '${newTask.assign_to}',
        '${newTask.task_date_due}',
        '${newTask.task_date_start}',
        '${timenow}'
        );`


        let newTaskData = await query(newTaskQuery);
        newTask.id = newTaskData.insertId;

        let deleteAssignProjectQuery = `DELETE FROM assign_projects WHERE project_id = ${newTask.project_id}`
        await query(deleteAssignProjectQuery);


        const values = newTask.teamMembers.map(member => 
            `(${newTask.project_id}, ${member.team_key}, ${member.id})`
          ).join(", ");

        let assignProjectQuery = `INSERT INTO assign_projects (project_id, team_key, user_id) VALUES ${values};`;
        await query(assignProjectQuery);

        // const values = newTask.teamMembers.map(member => 
        //     `(${newTask.project_id}, ${member.team_key}, ${member.id})`
        //   ).join(", ");

        // let assignProjectQuery = `INSERT INTO assign_projects (project_id, team_key, user_id) VALUES ${values};`;
        // await query(assignProjectQuery);

        

        return res.status(201).json({
            success: true,
            message: "task created successfully",
            response: newTask,
          });
    }catch(error){
        console.error("Error creating task:", error);
        return res.status(400).json({ success: false, message: "Failed to create task", error: error.message });
    }

}


export default AddTask;
