import query from "../../../lib/db";

const GetTeams = async (req, res) => {
    try{
        let teams = await query(`
           SELECT * FROM teams AS t
        `
        )

        if(teams.length == 0){
            return res.status(200).json({
                success: true,
                message: "No teams found.",
                response: teams,
        })      
        }

        return res.status(201).json({
          success: true,
          message: "teams fetched successfully",
          response: teams,
        });

        
  }catch(error){
      console.error("Error fetching teams:", error);
      return res.status(400).json({ success: false, message: "Failed to fetch teams", error: error.message });
  }

}


export default GetTeams;