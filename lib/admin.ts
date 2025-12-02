// Clerk auth disabled for demo mode
// import { auth } from "@clerk/nextjs/server";

export const getIsAdmin = async () => {
  // Auth disabled for demo mode - return false
  // const { userId } = await auth();
  // const adminIds = process.env.CLERK_ADMIN_IDS.split(", ");
  // if (!userId) return false;
  // return adminIds.indexOf(userId) !== -1;
  return false;
};
