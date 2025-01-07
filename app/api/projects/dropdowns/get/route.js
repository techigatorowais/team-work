import query from "../../../../../lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { team_key } = await request.json();

    const [projectCategories, projectStatus, clients, teamMembers] =
      await Promise.all([
        query(`
        SELECT * FROM project_categories AS pc
      `),
        query(`
        SELECT * FROM project_statuses AS ps
      `),
        query(`
        SELECT 
            c.id, 
            c.team_key, 
            c.brand_key, 
            c.creatorid, 
            c.name, 
            c.email, 
            u.id AS user_id,
            c.phone 
        FROM 
            clients AS c 
        JOIN 
            users AS u 
            ON u.clientid = c.id
        WHERE 
            c.team_key = ${team_key} 
            AND c.brand_key > 0 and c.id > 2 GROUP BY c.email 
           ORDER BY c.id desc ;
      `),
        query(`
        SELECT u.id, u.pseudo_name as name, u.email, u.team_key FROM users AS u WHERE u.team_key = ${team_key}
       and (type = 'lead' or  type = 'staff') and status = 1 and pseudo_name != '' `),
      ]);

    if (projectCategories.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "No project categories found.",
          response: projectCategories,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Project dropdown data fetched successfully",
        response: {
          projectCategories,
          projectStatus,
          clients,
          teamMembers,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error fetching project dropdown data and status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch project dropdown data and status",
        error: error.message,
      },
      { status: 400 }
    );
  }
}
