// app/api/register/route.ts
import { NextRequest } from "next/server"
import { handleRegister } from "@/lib/services/authService"

export async function POST(req: NextRequest) {
  return handleRegister(req)
}
