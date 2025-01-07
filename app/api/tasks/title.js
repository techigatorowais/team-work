import query from "../../../lib/db";

const UpdateTitle = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  let newTask = req.body;

  try {
    // const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let TaskQuery = `UPDATE tasks SET title = '${newTask.title}' WHERE  id = ${newTask.id}`;
    let newTaskData = await query(TaskQuery);
    return res.status(200).json({
      success: true,
      message: "Title updated successfully",
      response: newTaskData,
      query: TaskQuery,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to create task",
      error: error.message,
    });
  }
};

export default UpdateTitle;
