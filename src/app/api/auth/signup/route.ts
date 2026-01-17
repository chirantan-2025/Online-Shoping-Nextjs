import { db } from "@/db";
import { users, roles } from "@/db/schema";
import { backuserSchema } from "@/types/auth/userSchema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = backuserSchema.parse(body);

    // Check if email already exists
    const existingUserByEmail = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        { user: null, message: "This email already exists" },
        { status: 409 }
      );
    }

    // Check if phone already exists
    const existingUserByPhone = await db.query.users.findFirst({
      where: eq(users.phone, data.phone),
    });
    if (existingUserByPhone) {
      return NextResponse.json(
        { user: null, message: "This phone number already exists" },
        { status: 409 }
      );
    }

    // Get or create default "customer" role
    let customerRole = await db.query.roles.findFirst({
      where: eq(roles.name, "customer"),
    });

    if (!customerRole) {
      // Create customer role if it doesn't exist
      const [newRole] = await db
        .insert(roles)
        .values({
          name: "customer",
          description: "Regular customer role",
          isActive: true,
        })
        .returning();
      customerRole = newRole;
    }

    // Use provided roleId or default to customer role
    const roleId = data.roleId || customerRole.id;

    // Verify role exists
    const selectedRole = await db.query.roles.findFirst({
      where: eq(roles.id, roleId),
    });

    if (!selectedRole || !selectedRole.isActive) {
      return NextResponse.json(
        { user: null, message: "Invalid or inactive role" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        role_id: roleId,
        is_email_verified: false,
        is_phone_verified: false,
        status: "active",
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
      });

    return NextResponse.json(
      {
        user: newUser,
        message: "User registered successfully",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Signup error:", error);

    // Handle validation errors
    if (error instanceof Error && error.name === "ZodError") {
      const zodError = error as { errors?: unknown[] };
      return NextResponse.json(
        { user: null, message: "Validation error", errors: zodError.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { user: null, message: "Internal server error" },
      { status: 500 }
    );
  }
}
