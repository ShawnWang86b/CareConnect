import { neon } from "@neondatabase/serverless";

export async function GET(request: Request, params: any) {
  try {
    const { id } = params;
    console.log("id", id);

    const sql = neon(`${process.env.DATABASE_URL}`);

    // Fetch only medicines belonging to the logged-in user for the specific day
    const response = await sql`
      SELECT * FROM "my_medicine" WHERE "user_id" = ${id}`;

    console.log(response);
    return new Response(JSON.stringify({ data: response }), { status: 200 });
  } catch (error) {
    console.error("Error fetching my medicine:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
