import query from "../../../lib/db";

const GetTeam = async (req, res) => {
    const {team_key} = req.query;
    try{
        let teams = await query(`
           SELECT * FROM teams AS t WHERE t.team_key = ${team_key}
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


export default GetTeam;