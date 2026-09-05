import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const siteVisitorsTable = pgTable("site_visitors", {
  id: serial("id").primaryKey(),
  visitorKey: text("visitor_key").notNull().unique(),
  firstVisitedAt: timestamp("first_visited_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});