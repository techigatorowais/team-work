import query from "../../../../lib/db";

const GetStages = async (req, res) => {
  try {
    let stages = await query(`
          SELECT * FROM task_stages order by sort
        `);

    if (stages.length == 0) {
      return res.status(200).json({
        success: true,
        message: "No stages found.",
        response: stages,
      });
    }

    return res.status(201).json({
      success: true,
      message: "stages fetched successfully",
      response: stages,
    });
  } catch (error) {
    console.error("Error fetching stages:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to fetch stages",
      error: error.message,
    });
  }
};

export default GetStages;
