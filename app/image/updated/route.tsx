import prisma from "@/lib/prisma";

export async function GET() {
  const result = await prisma.bynderWebhookEvent.count();

  return Response.json({
    ok: true,
    result,
  });
}