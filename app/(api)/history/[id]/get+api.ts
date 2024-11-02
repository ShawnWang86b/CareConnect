import { neon } from "@neondatabase/serverless";

export async function GET(request: Request, params: any) {
  try {
    const { id } = params;

    const sql = neon(`${process.env.DATABASE_URL}`);

    const response = await sql`
      SELECT * FROM history WHERE user_id = ${id}`;

    return new Response(JSON.stringify({ data: response }), { status: 200 });
  } catch (error) {
    console.error("Error fetching my history:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
