import query from "../../../../lib/db";

const DeleteComment = async (req, res) => {
  const { commentId } = req.body;

  if (!commentId) {
    return res.status(400).json({
      success: false,
      message: "Comment ID is required",
    });
  }

  try {
    const result = await query(`
      UPDATE tm_comments
      SET status = 0, deleted_at = NOW()
      WHERE id = ${commentId} AND status = 1
    `);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Comment not found or already deleted",
        response: null
      });
    }

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      response: {commentId}
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete comment",
      response: null,
      error: error.message,
    });
  }
};

export default DeleteComment;
