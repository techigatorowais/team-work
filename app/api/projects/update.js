import query from '../../../lib/db';

const UpdateProject = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const editProject = req.body;

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
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let updateProjectQuery = `
        UPDATE projects
        SET
            team_key = '${editProject.team_key}', 
            brand_key = '${editProject.brand_key}', 
            creatorid = '${editProject.creatorid}', 
            clientid = '${editProject.clientid}', 
            category_id = '${editProject.category_id}', 
            project_title = '${editProject.project_title}', 
            project_description = '${editProject.project_description}', 
            project_status = '${editProject.project_status}', 
            my_teamwork = '${editProject.my_teamwork}',
            project_date_start = '${editProject.project_date_start}',
            project_date_due = '${editProject.project_date_due}',
            updated_at = '${timestamp}'
        WHERE id = '${editProject.project_id}';
        `;

    let editProjectData = await query(updateProjectQuery);

    let deleteAssignProjectQuery = `DELETE FROM assign_projects WHERE project_id = ${editProject.project_id}`;
    await query(deleteAssignProjectQuery);

    if (editProjectData.affectedRows > 0) {
      const values = editProject.teamMembers
        .map(
          (member) =>
            `(${editProject.project_id}, ${editProject.team_key}, ${member.id})`
        )
        .join(', ');

      let assignProjectQuery = `INSERT INTO assign_projects (project_id, team_key, user_id) VALUES ${values};`;
      await query(assignProjectQuery);
    }

    return res.status(201).json({
      success: true,
      message: 'Project updated successfully',
      response: editProject,
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return res.status(400).json({
      success: false,
      message: 'Failed to updated project',
      error: error.message,
    });
  }
};

export default UpdateProject;
