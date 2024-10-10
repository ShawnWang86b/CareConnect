import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // this dose should be default value
    const { title, imageUrl, description, brand, dose } = body;

    if (!title || !imageUrl || !description || !brand || !dose) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const sql = neon(`${process.env.DATABASE_URL}`);

    const response = await sql`
      INSERT INTO rides ( 
          title, imageUrl, description, brand, dose 
      ) VALUES (
          ${title},
          ${imageUrl},
          ${description},
          ${brand},
          ${dose},
      )
      RETURNING *;
    `;

    return Response.json({ data: response[0] }, { status: 201 });
  } catch (error) {
    console.error("Error inserting data into medicine:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
