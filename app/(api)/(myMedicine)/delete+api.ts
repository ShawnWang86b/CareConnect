import { neon } from "@neondatabase/serverless";
import { useUser } from "@clerk/clerk-expo"; // Import Clerk's user management

export async function DELETE(request: Request) {
  try {
    const { user } = useUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const userId = user.id; // Clerk's user ID
    const sql = neon(`${process.env.DATABASE_URL}`);

    const { medicineId } = await request.json(); // Expecting medicineId in the request body

    if (!medicineId) {
      return new Response(
        JSON.stringify({ error: "Medicine ID is required" }),
        {
          status: 400,
        }
      );
    }

    // Delete the medicine for the logged-in user
    const response = await sql`
      DELETE FROM myMedicine
      WHERE id = ${medicineId} AND user_id = ${userId}
      RETURNING *;
    `;

    if (response.length === 0) {
      return new Response(JSON.stringify({ error: "Medicine not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Medicine deleted successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting medicine:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
