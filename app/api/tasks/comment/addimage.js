import query from "../../../../lib/db";

const AddImage = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  let newComment = req.body;

  try {
    const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
    const newCommentQuery = `
        INSERT INTO tm_comments 
        (
           user_id,
            project_id,
            task_id,
            type,
            attachment_url,
            created_at
        ) VALUES 
        (
            '${newComment.user_id}', 
            '${newComment.project_id}', 
            '${newComment.task_id}', 
            'img', 
            '${newComment.attachments}', 
            '${timestamp}'
        );`;

    let commentDataData = await query(newCommentQuery);
    newComment.id = commentDataData.insertId;

    return res.status(201).json({
      success: true,
      message: "New Image added successfully",
      response: newComment,
    });
  } catch (error) {
    console.error("Error adding image to task:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to add image to task",
      error: error.message,
    });
  }
};

export default AddImage;
