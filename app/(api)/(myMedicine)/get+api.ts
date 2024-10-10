import { neon } from "@neondatabase/serverless";
import { useUser } from "@clerk/clerk-expo"; // Import Clerk's user management

export async function GET(request: Request) {
  try {
    const body = await request.json();
    const { day, user_id } = body;

    const sql = neon(`${process.env.DATABASE_URL}`);

    // Fetch only medicines belonging to the logged-in user
    const response =
      await sql`SELECT * FROM my-medicine WHERE user_id = ${user_id} AND day =${day}`;

    return new Response(JSON.stringify({ data: response }));
  } catch (error) {
    console.error("Error for user fetching medicine:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
