-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dateOfBirth" TEXT,
    "diagnosis" TEXT,
    "notificationLevel" TEXT NOT NULL DEFAULT 'medium',
    "quietHoursStart" TEXT,
    "quietHoursEnd" TEXT,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("createdAt", "dateOfBirth", "diagnosis", "email", "id", "name", "notificationLevel", "passwordHash", "quietHoursEnd", "quietHoursStart") SELECT "createdAt", "dateOfBirth", "diagnosis", "email", "id", "name", "notificationLevel", "passwordHash", "quietHoursEnd", "quietHoursStart" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
