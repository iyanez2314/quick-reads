import { createUserInDb } from "@/data-layer/user";
import { NextResponse, NextRequest } from "next/server";

export interface User {
  clerkId: string;
  name: string;
  email: string;
}

async function createUser(req: NextRequest) {
  try {
    const body = await req.json();
    const rawData = body.data;

    const fullName = rawData.first_name + " " + rawData.last_name;
    const emailAddress = rawData.email_addresses[0].email_address;
    const clerkId = rawData.id;

    const userObj: User = {
      clerkId,
      name: fullName,
      email: emailAddress,
    };

    const createdUser = await createUserInDb(userObj);

    if (createdUser.status !== 201) {
      return NextResponse.json({ message: "User not created", status: 400 });
    }

    console.log("User created: ", createdUser);
    return NextResponse.json({ message: "User created", status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}

export { createUser as POST };
