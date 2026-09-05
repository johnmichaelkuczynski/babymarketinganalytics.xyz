import { Router, type IRouter } from "express";
import { count } from "drizzle-orm";
import { db, siteVisitorsTable } from "@workspace/db";
import {
  RegisterVisitorBody,
  RegisterVisitorResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/visitors", async (req, res) => {
  try {
    const { visitorId } = RegisterVisitorBody.parse(req.body);

    await db
      .insert(siteVisitorsTable)
      .values({ visitorKey: visitorId })
      .onConflictDoNothing({ target: siteVisitorsTable.visitorKey });

    const [result] = await db
      .select({ value: count() })
      .from(siteVisitorsTable);

    res.json(RegisterVisitorResponse.parse({ count: result?.value ?? 0 }));
  } catch (error) {
    req.log.error({ error }, "Failed to register visitor");
    res.status(500).json({ error: "Failed to load visitor count" });
  }
});

export default router;