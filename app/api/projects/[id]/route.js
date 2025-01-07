import query from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const searchParams = request.nextUrl.searchParams;
  const team_key = searchParams.get('team_key');
  const type = searchParams.get('type');
  const userid = searchParams.get('userid');

  try {
    let myquery = ``;

    if (type === "client") {
      // Client-specific query
      myquery = `
        SELECT 
          p.id AS project_id,
          p.clientid AS client_id,
          u2.name AS created_by,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', u.id,
              'name', u.name,
              'email', u.email,
              'team_key', u.team_key
            )
          ) AS teamMembers,
          (
            SELECT COUNT(DISTINCT t.id)
              FROM tasks AS t
              WHERE t.project_id = p.id
          ) AS task_count,
          u.id AS user_id,
          p.creatorid,
          p.team_key,
          p.brand_key,
          p.category_id,
          p.project_status,
          b.name AS name,
          p.project_title,
          p.project_description,
          p.created_at,
          p.project_date_start,
          p.project_date_due,
          b.logo,
          uc.pseudo_name AS client_name
        FROM projects AS p
        JOIN assign_projects AS ap ON ap.project_id = p.id
        JOIN users AS u ON u.id = ap.user_id
        JOIN users AS u2 ON u2.id = p.creatorid
        JOIN users AS uc ON uc.id = p.clientid
        JOIN brands AS b ON b.brand_key = p.brand_key
        WHERE p.clientid = ${userid}
        GROUP BY ap.project_id
        ORDER BY p.id DESC;
      `;
    } else {
      // Team-specific query
      myquery = `
        SELECT 
          p.id AS project_id,
          p.clientid AS client_id,
          u2.name AS created_by,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', u.id,
              'name', u.name,
              'email', u.email,
              'team_key', u.team_key
            )
          ) AS teamMembers,
          (
            SELECT COUNT(DISTINCT t.id)
              FROM tasks AS t
              WHERE t.project_id = p.id
          ) AS task_count,
          u.id AS user_id,
          p.creatorid,
          p.team_key,
          p.brand_key,
          p.category_id,
          p.project_status,
          b.name AS name,
          p.project_title,
          p.project_description,
          p.created_at,
          p.project_date_start,
          p.project_date_due,
          b.logo,
          uc.pseudo_name AS client_name
        FROM projects AS p
        JOIN assign_projects AS ap ON ap.project_id = p.id
        JOIN users AS u ON u.id = ap.user_id
        JOIN users AS u2 ON u2.id = p.creatorid
        JOIN users AS uc ON uc.id = p.clientid
        JOIN brands AS b ON b.brand_key = p.brand_key
        WHERE p.team_key = ${team_key}
        GROUP BY ap.project_id
        ORDER BY p.id DESC;
      `;
    }

    let projects = await query(myquery);

    if (projects.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No projects found against your team",
        response: null,
      }, { status: 200 });
    }

    projects = projects.map((element) => {
      return {
        ...element,
        teamMembers: JSON.parse(element.teamMembers),
      };
    });

    return NextResponse.json({
      success: true,
      message: "Projects fetched successfully",
      response: projects,
    }, { status: 200 });

  } catch (error) {
    console.error("Error ", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch project",
      query: "Failed to fetch project", 
      error: error.message,
    }, { status: 400 });
  }
}

function groupBy(objectArray, property) {
  return objectArray.reduce((acc, obj) => {
    const key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
}
