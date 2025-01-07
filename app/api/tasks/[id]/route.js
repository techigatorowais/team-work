import query from "../../../../lib/db";
const GetTaskListByProject = async (req, res) => {
  const { projectId } = req.query;
  try {
    let [pendingTasks, completedTasks, teamMembers, tags] = await Promise.all([
      query(`
          SELECT t.id, t.created, t.project_id, t.title, t.last_updated, t.proiority, t.description, t.due_date, t.created_at, t.updated_at, t.created_by, u.pseudo_name AS 'createdByName', t.progress, t.proiority, t.task_stage,
          t.completed as 'status', t.updated_by, u2.name AS 'updatedByName',
          CASE
          WHEN t.proiority = 1 THEN 'Low'
          WHEN t.proiority = 2 THEN 'Medium'
          WHEN t.proiority = 3 THEN 'High'
          ELSE 'unknown'
          END AS priority_name,
          (SELECT COUNT(*) FROM tm_comments AS tmc WHERE tmc.task_id = t.id AND tmc.status = 1) AS 'commentCount'
          FROM tasks AS t
          JOIN users AS u ON u.id = t.created_by
          JOIN users AS u2 ON u2.id = t.updated_by
          WHERE t.project_id = ${projectId} AND t.completed = 0
        `),
      query(`
          SELECT t.id, t.created, t.project_id, t.title, t.last_updated, t.proiority, t.description, t.due_date, t.created_at, t.updated_at, t.created_by, u.pseudo_name AS 'createdByName', t.progress, t.proiority, t.task_stage,
          t.completed as 'status', t.updated_by, u2.name AS 'updatedByName',
          CASE
          WHEN t.proiority = 1 THEN 'Low'
          WHEN t.proiority = 2 THEN 'Medium'
          WHEN t.proiority = 3 THEN 'High'
          ELSE 'unknown'
          END AS priority_name,
          (SELECT COUNT(*) FROM tm_comments AS tmc WHERE tmc.task_id = t.id AND tmc.status = 1) AS 'commentCount'
          FROM tasks AS t
          JOIN users AS u ON u.id = t.created_by
          JOIN users AS u2 ON u2.id = t.updated_by
          WHERE t.project_id = ${projectId} AND t.completed = 1
        `),
      query(`
          SELECT ap.project_id, ap.team_key, ap.user_id as 'id', u.pseudo_name as name, u.email FROM assign_projects AS ap
          JOIN users AS u ON u.id = ap.user_id
          WHERE ap.project_id = ${projectId}
        `),
      query(`
          SELECT * FROM tasks_tags where status = 1
        `),
    ]);

    return res.status(201).json({
      success: true,
      message: "tasks fetched successfully",
      response: { pendingTasks, completedTasks, teamMembers, tags },
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};

const groupBy = (objectArray, property) => {
  return objectArray.reduce((acc, obj) => {
    const key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
};

export default GetTaskListByProject;
