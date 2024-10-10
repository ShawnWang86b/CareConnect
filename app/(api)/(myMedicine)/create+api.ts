import { neon } from "@neondatabase/serverless"; // Import Clerk's user management

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);

    const body = await request.json();
    const { name, description, day, time, user_id } = body; // Add your necessary medicine fields

    // Ensure all required fields are present
    if (!name || !description || !day || !time || !user_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
        }
      );
    }

    // Insert new medicine for the authenticated user
    const response = await sql`
      INSERT INTO my_medicine (name, description, day, time, user_id)
      VALUES (${name}, ${description}, ${day}, ${time}, ${user_id})
      RETURNING *;
    `;

    return new Response(
      JSON.stringify({
        message: "Medicine added successfully!",
        data: response,
      }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error creating my medicine:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
