import { neon } from '@neondatabase/serverless';

export async function GET(request: Request) {
  try {
    // Initialize Neon with the database URL from environment variables
    const sql = neon(`${process.env.DATABASE_URL}`);

    // Query to select all columns from the doctors table, including the new email field
    const response = await sql`SELECT * FROM doctors`;

    // Return the data as a JSON response
    return Response.json({ data: response });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
