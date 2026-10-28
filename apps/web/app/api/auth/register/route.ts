import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse as NextRes } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, phone, password, role, adminSecret, address2 } = await req.json();

    if (!name || !email || !password || !phone) {
      return NextRes.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Honeypot check: If the hidden field 'address2' is filled, it's likely a bot
    if (address2) {
      return NextRes.json(
        { message: "Registration blocked due to suspicious activity." },
        { status: 403 }
      );
    }

    let finalRole = 'PATIENT';
    if (role === 'LAB_PARTNER') {
      finalRole = 'LAB_PARTNER';
    } else if (role === 'ADMIN') {
      if (!process.env.ADMIN_SIGNUP_SECRET || adminSecret !== process.env.ADMIN_SIGNUP_SECRET) {
        return NextRes.json(
          { message: "Invalid or missing admin secret" },
          { status: 401 }
        );
      }
      finalRole = 'ADMIN';
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      return NextRes.json(
        { message: "User with this email or phone already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash: hashedPassword,
        role: finalRole,
      },
    });

    return NextRes.json(
      { message: "User created successfully", user: { id: newUser.id, name: newUser.name, email: newUser.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextRes.json(
      { message: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
