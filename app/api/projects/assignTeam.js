import query from "../../../lib/db";

const AddMemberToProject = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { teamMembers } = req.body;
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
    const values = teamMembers
      .map(
        (member) =>
          `(${member.project_id}, ${member.team_key}, ${member.user_id})`
      )
      .join(", ");

    let assignProjectQuery = `INSERT INTO assign_projects (project_id, team_key, user_id) VALUES ${values};`;
    await query(assignProjectQuery);

    if (assignProjectQuery.affectedRows == 0) {
      return res.status(400).json({
        success: false,
        message: "Member(s) not assigned",
        response: null,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Team Member(s) has been added to project",
      response: teamMembers,
    });
  } catch (error) {
    console.error("Error adding team members to project:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to add team member in project",
      error: error.message,
    });
  }
};

export default AddMemberToProject;
