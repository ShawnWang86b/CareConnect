import { neon } from "@neondatabase/serverless";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, title, imageUrl, description, brand, dose } = body;

    if (!id) {
      return Response.json(
        { error: "Missing required field: id" },
        { status: 400 }
      );
    }

    const sql = neon(`${process.env.DATABASE_URL}`);

    const response = await sql`
      UPDATE rides
      SET
        title = ${title || null},
        imageUrl = ${imageUrl || null},
        description = ${description || null},
        brand = ${brand || null},
        dose = ${dose || null}
      WHERE id = ${id}
      RETURNING *;
    `;

    if (response.length === 0) {
      return Response.json({ error: "Record not found" }, { status: 404 });
    }

    return Response.json({ data: response[0] }, { status: 200 });
  } catch (error) {
    console.error("Error updating record:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
