-- DropForeignKey
ALTER TABLE "public"."Event" DROP CONSTRAINT "Event_watchlistId_fkey";

-- AlterTable
ALTER TABLE "public"."Watchlist" ADD COLUMN     "events" TEXT[];
