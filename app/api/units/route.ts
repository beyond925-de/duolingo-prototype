import { type NextRequest, NextResponse } from "next/server";

// Database disabled for demo mode
// import db from "@/db/drizzle";
// import { units } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export const GET = async () => {
  // Database disabled for demo mode - return empty array
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  // const data = await db.query.units.findMany();
  // return NextResponse.json(data);
  return NextResponse.json([]);
};

export const POST = async (req: NextRequest) => {
  // Database disabled for demo mode
  const isAdmin = await getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  // const body = (await req.json()) as typeof units.$inferSelect;
  // const data = await db.insert(units).values({ ...body }).returning();
  // return NextResponse.json(data[0]);
  return NextResponse.json({});
};
