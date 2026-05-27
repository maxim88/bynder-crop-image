-- CreateTable
CREATE TABLE "BynderWebhookEvent" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "assetId" TEXT,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BynderWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BynderWebhookEvent_topic_idx" ON "BynderWebhookEvent"("topic");

-- CreateIndex
CREATE INDEX "BynderWebhookEvent_assetId_idx" ON "BynderWebhookEvent"("assetId");
