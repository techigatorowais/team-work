import query from "../../../lib/db";
import axios from "axios";
import { tgcrm } from "../../../utils/const";
const AddClient = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  let newclient = req.body;

  (newclient["assigned_departments"] = [1]),
    (newclient["user_access"] = 1),
    (newclient["type"] = "client");

  try {
    console.log("newclient", newclient);
    //laravel api call for registration
    let newClientResponse = await axios.post(
      `${tgcrm}api/createclient`,
      newclient
    );
    //

    newClientResponse = newClientResponse["data"];

    let bakeClientBody = {
      id: newClientResponse["client"]["id"],
      team_key: newclient.team_key,
      brand_key: newclient.brand_key,
      creatorid: newclient.creatorid,
      name: newclient.name,
      email: newclient.email,
      phone: newclient.phone,
    };
    return res.status(201).json({
      success: true,
      message: "New client added successfully",
      response: bakeClientBody,
    });
  } catch (error) {
    console.error("Error adding client:", error.message);
    return res.status(400).json({
      success: false,
      message: "Failed to add client",
      error: error.message,
    });
  }
};

export default AddClient;

const Login = async (req, res) => {
  const { token } = req.query;
  try {
    let response = await axios.get(`${tgcrm}api/user`, {
      headers: {
        Authorization: `Bearer ${token} `,
      },
    });

    res.setHeader(
      "Set-Cookie",
      `access_token=${token}; HttpOnly; Path=/; Max-Age=604800; Secure`
    );
    response = response.data;
    return res
      .status(200)
      .json({ success: true, message: "Logged successfully", response });
  } catch (error) {
    console.log("er---> ", error);
    return res.status(400).json({
      success: false,
      message: "Server not responsding",
      response: null,
    });
  }
};
