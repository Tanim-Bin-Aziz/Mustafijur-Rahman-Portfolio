import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * /dashboard ar /login chara baki shob static/asset request-e
     * middleware run na kora - unnecessary overhead avoid korar jonno
     */
    "/dashboard/:path*",
    "/login",
  ],
};
