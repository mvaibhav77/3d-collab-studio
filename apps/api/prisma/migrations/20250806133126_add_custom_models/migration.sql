-- CreateTable
CREATE TABLE "custom_models" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "appwriteId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "custom_models_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "custom_models_appwriteId_key" ON "custom_models"("appwriteId");

-- AddForeignKey
ALTER TABLE "custom_models" ADD CONSTRAINT "custom_models_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
