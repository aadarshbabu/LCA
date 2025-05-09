-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Video" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "categoryId" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "duration" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "rejectReason" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "isPublish" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "url" TEXT,
    "resolutions" JSONB,
    "isYoutubeUrl" BOOLEAN NOT NULL DEFAULT false,
    "creatorId" TEXT NOT NULL DEFAULT 'creator-x',
    CONSTRAINT "Video_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Video_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Video_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Video" ("categoryId", "createdAt", "creatorId", "description", "duration", "id", "isApproved", "isYoutubeUrl", "price", "rejectReason", "resolutions", "thumbnail", "title", "updatedAt", "url", "userId", "views") SELECT "categoryId", "createdAt", "creatorId", "description", "duration", "id", "isApproved", "isYoutubeUrl", "price", "rejectReason", "resolutions", "thumbnail", "title", "updatedAt", "url", "userId", "views" FROM "Video";
DROP TABLE "Video";
ALTER TABLE "new_Video" RENAME TO "Video";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
