import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    console.log("DATABASE_URL:", process.env.DATABASE_URL);
    const response = await sql`SELECT "name", "description" FROM medicines`;

    console.log(
      "success:",
      new Response(JSON.stringify({ data: response }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    return new Response(JSON.stringify({ data: response }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching medicine:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
