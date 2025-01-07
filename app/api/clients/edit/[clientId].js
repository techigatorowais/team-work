// import query from '../../../../lib/db';
// import prisma from '../../../lib/prisma'

const EditClient = async (req, res) => {
    
    if (req.method !== "PUT") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    let { clientId } = req.query;
    try{
        let updatedClientData = await prisma.clients.update({
            where: {
                id: clientId
            },
            data: {
                team_key: 0,
                brand_key: 0,
                creatorid: 0,
                name: '',
                email: '',
                phone: '',
                status: 1
            }
        });
        return res.status(201).json({
          success: true,
          message: "Client details updated successfully",
          response: updatedClientData,
        });

        
  }catch(error){
      console.error("Error updating client details:", error);
      return res.status(400).json({ success: false, message: "Failed to update client details", error: error.message });
  }

}

export default EditClient;
