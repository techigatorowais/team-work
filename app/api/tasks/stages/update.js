import query from "../../../../lib/db";

const UpdateTaskStage = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  let newTask = req.body;

  try {
    let newTaskQuery = `UPDATE tasks SET task_stage = '${newTask.task_stage}' WHERE  id = '${newTask.id}' `;
    let newTaskData = await query(newTaskQuery);

    return res.status(201).json({
      success: true,
      message: "stage update successfully",
      response: newTaskData,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to update the task",
      error: error.message,
    });
  }
};

export default UpdateTaskStage;
