import query from "../../../../lib/db";

const GetActivitiesByTaskId = async (req, res) => {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { task_id } = req.query;

    if (!task_id) {
        return res.status(400).json({
            success: false,
            message: "Task ID is required",
        });
    }

    try {
        const getActivitiesQuery = `
            SELECT 
                twa.id,
                u.name,
                twa.user_id,
                twa.task_id,
                twa.project_id,
                twa.activity,
                twa.activity_type,
                twa.created_at,
                twa.updated_at
            FROM team_work_activities AS twa
            JOIN users AS u ON u.id = twa.user_id
            WHERE twa.task_id = ${task_id}
            ORDER BY twa.created_at DESC;
        `;

        const activities = await query(getActivitiesQuery);

        if (activities.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No activities found for the specified task ID",
                response: []
            });
        }

        return res.status(200).json({
            success: true,
            message: "Activities retrieved successfully",
            response: activities,
        });
    } catch (error) {
        console.error("Error retrieving activities:", error);
        return res.status(400).json({
            success: false,
            message: "Failed to retrieve activities",
            error: error.message,
        });
    }
};

export default GetActivitiesByTaskId;
