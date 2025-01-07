import query from "../../../lib/db";

const SendActivityEmail = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  let {task_id, title, message} = req.body;

  try {

    let client = await query(`
        SELECT u.id FROM tasks AS t 
        JOIN projects AS p ON p.id = t.project_id
        JOIN clients AS c ON c.id = p.clientid
        JOIN users AS u ON u.clientid = c.id
        WHERE t.id = ${task_id}
        `)

    if(client.length > 0){
        client = client[0]["id"];
        return res.status(200).json({
            success: true,
            message: "Notification sent to client",
            response: {
                id:client,
                title,
                message
            },
          });

    }else{
        return res.status(200).json({
            success: true,
            message: "No client found against this task",
            response: null,
          });
    }
   
  } catch (error) {
    console.error("Error sending notifcation", error);
    return res.status(400).json({
      success: false,
      message: "Failed to send notification",
      error: error.message,
    });
  }
};

export default SendActivityEmail;
