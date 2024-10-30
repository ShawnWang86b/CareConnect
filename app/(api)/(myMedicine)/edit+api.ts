import { neon } from "@neondatabase/serverless"; // Import Clerk's user management

export async function PUT(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);

    const body = await request.json();
    // console.log("body", body);
    const { id, name, description, start_date, end_date, time, user_id } = body; // Add your necessary medicine fields

    // Ensure all required fields are present
    if (!id || !name || !description || !start_date || !end_date || !time || !user_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
        },
      );
    }

    // Update existing medicine for the authenticated user
    const response = await sql`
      UPDATE my_medicine 
      SET name = ${name}, 
          description = ${description}, 
          start_date = ${start_date}, 
          end_date = ${end_date}, 
          time = ${JSON.stringify(time)}
      WHERE id = ${id} AND user_id = ${user_id}
      RETURNING *;
    `;

    if (response.length === 0) {
      return new Response(
        JSON.stringify({ error: "Medicine not found or not authorized" }),
        {
          status: 404,
        },
      );
    }

    return new Response(
      JSON.stringify({
        message: "Medicine updated successfully!",
        data: response[0],
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error updating my medicine:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
