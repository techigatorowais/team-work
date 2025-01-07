import query from "../../../lib/db";

const GetBrands = async (req, res) => {
  // console.log("GetBrands__", req);
  const response = req;
  // console.log("GetBrands__response", response.query.brand_key);
  try {
    let brand_query = `SELECT brands.id, brands.brand_key, brands.name, brands.brand_type FROM brands
      JOIN assign_brands ON assign_brands.brand_key = brands.brand_key
      JOIN teams ON assign_brands.team_key = teams.team_key
      where assign_brands.team_key = ${response.query.brand_key} and  brands.status = 1`;
    //
    // return false;

    let brands = await query(brand_query);

    if (brands.length == 0) {
      return res.status(200).json({
        success: true,
        message: "No brands found.",
        response: brands,
      });
    }

    return res.status(201).json({
      success: true,
      message: "brands fetched successfully",
      response: brands,
    });
  } catch (error) {
    console.error("Error fetching brands:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to fetch brands",
      error: error.message,
    });
  }
};

export default GetBrands;
