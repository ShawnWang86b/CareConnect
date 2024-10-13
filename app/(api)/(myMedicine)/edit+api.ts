import { neon } from "@neondatabase/serverless";
import { useUser } from "@clerk/clerk-expo"; // Import Clerk's user management

export async function PUT(request: Request) {
  try {
    const { user } = useUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const userId = user.id; // Clerk's user ID
    const sql = neon(`${process.env.DATABASE_URL}`);

    const body = await request.json();
    const { medicineId, name, dosage, description } = body;

    // Ensure all required fields are present
    if (!medicineId || !name || !dosage) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
        }
      );
    }

    // Update the medicine for the logged-in user
    const response = await sql`
      UPDATE my_medicine
      SET name = ${name}, dosage = ${dosage}, description = ${description}
      WHERE id = ${medicineId} AND user_id = ${userId}
      RETURNING *;
    `;

    if (response.length === 0) {
      return new Response(JSON.stringify({ error: "Medicine not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ data: response }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating medicine:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
