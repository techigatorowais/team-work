import query from "../../../../lib/db";

const GetClientDetails = async (req, res) => {

    let { clientId } = req.query;

    try{
      let clients = await query(`
         SELECT * FROM clients AS c WHERE c.id = ${clientId}
      `)

      if(clients.length == 0){
        return res.status(200).json({
              success: true,
              message: "No client found.",
              response: clients,
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Client fetched successfully",
        response: clients,
      });
  
      
  }catch(error){
    console.error("Error fetching client:", error);
    return res.status(200).json({ success: false, message: "Failed to fetch clients", error: error.message });
  }

}



export default GetClientDetails;
