-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PainEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "intensity" INTEGER NOT NULL,
    "bodyRegion" TEXT,
    "painSensation" TEXT,
    "painIntensityLevel" TEXT,
    "painTemporality" TEXT,
    "moodStates" TEXT,
    "musclePainLevels" TEXT,
    "notes" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PainEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PainEntry" ("bodyRegion", "id", "intensity", "moodStates", "notes", "painIntensityLevel", "painSensation", "painTemporality", "timestamp", "userId") SELECT "bodyRegion", "id", "intensity", "moodStates", "notes", "painIntensityLevel", "painSensation", "painTemporality", "timestamp", "userId" FROM "PainEntry";
DROP TABLE "PainEntry";
ALTER TABLE "new_PainEntry" RENAME TO "PainEntry";
CREATE INDEX "PainEntry_userId_timestamp_idx" ON "PainEntry"("userId", "timestamp");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
