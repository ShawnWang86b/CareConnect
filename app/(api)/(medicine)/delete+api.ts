import { neon } from "@neondatabase/serverless";

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return Response.json(
        { error: "Missing required field: id" },
        { status: 400 }
      );
    }

    const sql = neon(`${process.env.DATABASE_URL}`);

    const response = await sql`
      DELETE FROM rides
      WHERE id = ${id}
      RETURNING *;
    `;

    if (response.length === 0) {
      return Response.json({ error: "Record not found" }, { status: 404 });
    }

    return Response.json({ data: response[0] }, { status: 200 });
  } catch (error) {
    console.error("Error deleting record:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
