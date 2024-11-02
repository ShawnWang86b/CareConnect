import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { shop, user_id } = body;
    console.log("shop", shop);
    console.log("user_id", user_id);
    if (!shop || !user_id) {
      return new Response(
        JSON.stringify({ error: "Missing required shop object or user_id" }),
        { status: 400 }
      );
    }

    const sql = neon(`${process.env.DATABASE_URL}`);

    const response = await sql`
      INSERT INTO history (shop, user_id) 
      VALUES (${shop}, ${user_id})
      RETURNING *;
    `;

    return new Response(JSON.stringify({ data: response[0] }), { status: 201 });
  } catch (error) {
    console.error("Error inserting data into history:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
