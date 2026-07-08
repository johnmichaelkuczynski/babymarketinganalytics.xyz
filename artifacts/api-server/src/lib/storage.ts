import { db } from "@workspace/db";
import { usersTable, visitsTable } from "@workspace/db";
import { eq, desc, gte, isNull, or } from "drizzle-orm";

export type User = typeof usersTable.$inferSelect;

export const storage = {
  async getUserById(id: number): Promise<User | null> {
    const rows = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
    return rows[0] ?? null;
  },

  async getUserByGoogleId(googleId: string): Promise<User | null> {
    const rows = await db.select().from(usersTable).where(eq(usersTable.googleId, googleId)).limit(1);
    return rows[0] ?? null;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const rows = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    return rows[0] ?? null;
  },

  async createUserWithGoogle(data: {
    username: string;
    googleId: string;
    email: string | null;
    displayName: string | null;
  }): Promise<User> {
    const rows = await db
      .insert(usersTable)
      .values({
        username: data.username,
        googleId: data.googleId,
        email: data.email,
        displayName: data.displayName,
      })
      .returning();
    return rows[0]!;
  },

  async updateUserGoogle(
    id: number,
    data: { googleId?: string; displayName?: string | null },
  ): Promise<User> {
    const rows = await db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.id, id))
      .returning();
    return rows[0]!;
  },

  async recordVisit(userId: number, email: string | null): Promise<void> {
    await db.insert(visitsTable).values({ userId, email });
  },

  async getVisits(limit: number): Promise<typeof visitsTable.$inferSelect[]> {
    return db
      .select()
      .from(visitsTable)
      .orderBy(desc(visitsTable.visitedAt))
      .limit(limit);
  },

  async getUsers(): Promise<typeof usersTable.$inferSelect[]> {
    return db
      .select()
      .from(usersTable)
      .orderBy(desc(usersTable.updatedAt));
  },

  async getVisitTimestampsSince(since: Date | null): Promise<string[]> {
    const rows = since
      ? await db
          .select({ visitedAt: visitsTable.visitedAt })
          .from(visitsTable)
          .where(gte(visitsTable.visitedAt, since))
      : await db.select({ visitedAt: visitsTable.visitedAt }).from(visitsTable);
    return rows.map((r) => r.visitedAt.toISOString());
  },
};
