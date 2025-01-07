import query from "../../../../lib/db";

const AddActivity = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  let newActivity = req.body;

  try {
    // const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let newActivityQuery = `INSERT INTO team_work_activities 
        (
        user_id,
        task_id,
        project_id,
        activity, 
        activity_type
        ) VALUES 
         (
        '${newActivity.user_id}', 
        '${newActivity.task_id}',
        '${newActivity.project_id}', 
        '${newActivity.activity}', 
        '${newActivity.activity_type}'
        );`;

    let newActivityData = await query(newActivityQuery);
    newActivity.id = newActivityData.insertId;

    return res.status(201).json({
      success: true,
      message: "activity posted successfully",
      response: newActivityData,
    });
  } catch (error) {
    console.error("Error posting activity:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to post activity",
      error: error.message,
    });
  }
};

export default AddActivity;
