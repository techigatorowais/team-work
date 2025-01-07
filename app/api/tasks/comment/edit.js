import query from "../../../../lib/db";

const UpdateComment = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  let updatedComment = req.body;
  let timenow = new Date().toISOString();

  try {
    const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");

    const updateCommentQuery = `
            UPDATE tm_comments 
            SET 
                comment = '${updatedComment.comment}', 
                updated_at = '${timestamp}' ,
                utctime = '${timenow}'
            WHERE id = '${updatedComment.id}' 
                AND user_id = '${updatedComment.user_id}';
        `;

    const result = await query(updateCommentQuery);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "Comment not found or you do not have permission to edit this comment.",
          response: null,
        });
    }

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      response: {
        id: updatedComment.id,
        updated_at: timestamp,
        comment: updatedComment.comment,
      },
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    return res
      .status(400)
      .json({
        success: false,
        message: "Failed to update comment",
        error: error.message,
      });
  }
};

export default UpdateComment;
