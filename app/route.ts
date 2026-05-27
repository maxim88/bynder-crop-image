import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
 
export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const snsMessage = JSON.parse(rawBody);

    if (snsMessage.Type === "SubscriptionConfirmation") {
      await fetch(snsMessage.SubscribeURL);
      return Response.json({ ok: true, message: "SNS subscription confirmed" });
    }

    if (snsMessage.Type === "Notification") {
      const bynderEvent = JSON.parse(snsMessage.Message);

      const topic = bynderEvent.topic;
      const assetId =
        bynderEvent.data?.mediaId ||
        bynderEvent.data?.id ||
        bynderEvent.mediaId ||
        null;

      await prisma.bynderWebhookEvent.create({
        data: {
          topic,
          assetId,
          payload: bynderEvent,
        },
      });

      if (topic === "asset_bank_media_create") {
        console.log("Saved new Bynder asset event:", assetId);
      }

      return Response.json({ ok: true, message: "Webhook saved" });
    }

    return Response.json({ ok: true, message: "Ignored message type" });
  } catch (error) {
    console.error("Bynder webhook error:", error);

    return Response.json(
      { ok: false, message: "Webhook failed" },
      { status: 500 }
    );
  }
}