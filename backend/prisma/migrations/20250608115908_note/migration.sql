-- AddForeignKey
ALTER TABLE "user_notes" ADD CONSTRAINT "user_notes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
