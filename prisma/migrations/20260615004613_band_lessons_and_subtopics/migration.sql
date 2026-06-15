-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lesson" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "topicId" TEXT NOT NULL,
    "band" TEXT NOT NULL DEFAULT 'all',
    "bodyMarkdown" TEXT NOT NULL,
    CONSTRAINT "Lesson_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Lesson" ("bodyMarkdown", "id", "topicId") SELECT "bodyMarkdown", "id", "topicId" FROM "Lesson";
DROP TABLE "Lesson";
ALTER TABLE "new_Lesson" RENAME TO "Lesson";
CREATE UNIQUE INDEX "Lesson_topicId_band_key" ON "Lesson"("topicId", "band");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
