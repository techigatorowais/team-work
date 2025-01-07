import query from "../../../../lib/db";

const AddComment = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    let newComment = req.body;
   
    try{
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
         let timenow = new Date().toISOString()

        const newCommentQuery = `
        INSERT INTO tm_comments 
        (
            user_id,
            project_id,
            task_id,
            comment,
            attachment_url,
            created_at,
            utctime
        ) VALUES 
        (
            '${newComment.user_id}', 
            '${newComment.project_id}', 
            '${newComment.task_id}', 
            '${newComment.comment}', 
            '${newComment.attachments}', 
            '${timestamp}',
            '${timenow}'
        );`;

        console.log('query_comemnt',newCommentQuery);



        let commentDataData = await query(newCommentQuery);
        newComment.id = commentDataData.insertId;

        

        return res.status(201).json({
            success: true,
            message: "New comment added successfully",
            response: newComment,
          });
    }catch(error){
        console.error("Error adding comment to task:", error);
        return res.status(400).json({ success: false, message: "Failed to add comment to task", error: error.message });
    }

}


export default AddComment;
