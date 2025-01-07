import query from "../../../lib/db";

const CreateProject = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const newProject = req.body;
  //template
  // {
  //     team_key: null,
  //     brand_key: null,
  //     creatorid: null,
  //     clientid: null,
  //     agent_id: null,
  //     asigned_id: null,
  //     category_id: null,
  //     project_title: null,
  //     project_date_start: null,
  //     project_date_due: null,
  //     project_description: null,
  //     project_status: null,
  //     project_cost: null,
  //     project_progress: null,
  //     priority: null,
  //     created_at: new Date(),
  //     updated_at: new Date(),
  // }

  try {
    const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
    let newProjectQuery = `INSERT INTO projects 
        (
        team_key,
        brand_key, 
        creatorid, 
        clientid, 
        category_id, 
        project_title, 
        project_description, 
        project_status, 
        my_teamwork,
        project_date_start,
        project_date_due,
        created_at
        ) VALUES 
         (
        '${newProject.team_key}', 
        '${newProject.brand_key}', 
        '${newProject.creatorid}', 
        '${newProject.clientid}', 
        '${newProject.category_id}', 
        '${newProject.project_title}', 
        '${newProject.project_description}', 
        '${newProject.project_status}', 
        '${newProject.my_teamwork}',
        '${newProject.project_date_start}',
        '${newProject.project_date_due}',
        '${timestamp}'
        );`;

    let newProjectData = await query(newProjectQuery);
    if (newProjectData.affectedRows > 0) {
      newProjectData.id = newProjectData.insertId;

      const values = newProject.teamMembers
        .map(
          (member) =>
            `(${newProjectData.insertId}, ${newProject.team_key}, ${member.id})`
        )
        .join(", ");

      let assignProjectQuery = `INSERT INTO assign_projects (project_id, team_key, user_id) VALUES ${values};`;
      let assignprojects = await query(assignProjectQuery);

      return res.status(201).json({
        success: true,
        message: "Project created successfully",
        response: newProjectData,
      });

      // console.log("assignprojects__", assignprojects);
    }
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to create project",
      error: error.message,
    });
  }
};

export default CreateProject;
