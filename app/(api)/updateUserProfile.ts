import { neon } from "@neondatabase/serverless";

// 处理 API 请求，重置用户名和密码
export async function PUT(request: Request) {
  try {
    const { clerkId, newUsername, newPassword } = await request.json();

    // 校验请求参数
    if (!clerkId || (!newUsername && !newPassword)) {
      return new Response(JSON.stringify({ error: "Missing parameters" }), { status: 400 });
    }

    // 初始化 Neon 数据库连接
    const sql = neon(`${process.env.DATABASE_URL}`);

    // 构建更新查询
    let query;
    if (newUsername && newPassword) {
      query = sql`UPDATE users SET name = ${newUsername}, password = ${newPassword} WHERE clerk_id = ${clerkId}`;
    } else if (newUsername) {
      query = sql`UPDATE users SET name = ${newUsername} WHERE clerk_id = ${clerkId}`;
    } else if (newPassword) {
      query = sql`UPDATE users SET password = ${newPassword} WHERE clerk_id = ${clerkId}`;
    }

    // 执行更新查询
    const result = await query;

    // 返回成功消息
    return new Response(JSON.stringify({ message: "Profile updated successfully", data: result }), { status: 200 });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
