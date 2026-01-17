import { db } from "@/db";
import { roles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const activeRoles = await db.query.roles.findMany({
      where: eq(roles.isActive, true),
      columns: {
        id: true,
        name: true,
        description: true,
      },
      orderBy: (roles, { asc }) => [asc(roles.name)],
    });

    return NextResponse.json(
      {
        roles: activeRoles,
        message: "Roles fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { roles: [], message: "Internal server error" },
      { status: 500 }
    );
  }
}

