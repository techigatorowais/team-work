import query from "../../../lib/db";

const GetAllClients = async (req, res) => {
  let { team_key } = req.query;

  try {
    let clients = await query(`
           SELECT * FROM clients AS c WHERE c.team_key = ${team_key} and c.id > 2
        `);

    if (clients.length == 0) {
      return res.status(200).json({
        success: true,
        message: "No clients found.",
        response: clients,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Client fetched successfully",
      response: clients,
    });
  } catch (error) {
    console.error("Error fetching client:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to fetch clients",
      error: error.message,
    });
  }
};

export default GetAllClients;
