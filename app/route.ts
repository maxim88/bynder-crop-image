import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const snsMessage = JSON.parse(rawBody);

    // 1. Confirm AWS SNS subscription
    if (snsMessage.Type === "SubscriptionConfirmation") {
      await fetch(snsMessage.SubscribeURL);

      return Response.json({
        ok: true,
        message: "SNS subscription confirmed",
      });
    }

    // 2. Handle Bynder notification
    if (snsMessage.Type === "Notification") {
      const bynderEvent = JSON.parse(snsMessage.Message);

      console.log("Bynder event:", bynderEvent);

      if (bynderEvent.topic === "asset_bank_media_create") {
        const assetId =
          bynderEvent.data?.mediaId ||
          bynderEvent.data?.id ||
          bynderEvent.mediaId;

        console.log("New Bynder asset created:", assetId);

        // TODO:
        // - save to DB
        // - call Bynder API
        // - trigger metadata sync
        // - send Slack notification
      }

      return Response.json({
        ok: true,
        message: "Webhook processed",
      });
    }

    return Response.json({
      ok: true,
      message: "Ignored message type",
    });
  } catch (error) {
    console.error("Bynder webhook error:", error);

    return Response.json(
      {
        ok: false,
        message: "Webhook failed",
      },
      { status: 500 }
    );
  }
}