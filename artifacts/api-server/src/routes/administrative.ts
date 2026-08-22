import { Router, type IRouter } from "express";
import { storage } from "../lib/storage.js";

const router: IRouter = Router();

router.get("/admin/visits", async (req, res) => {
  try {
    const now = Date.now();
    const HOUR = 60 * 60 * 1000;
    const DAY = 24 * HOUR;
    const dayAgo = new Date(now - DAY);
    const weekAgo = new Date(now - 7 * DAY);
    const monthAgo = new Date(now - 30 * DAY);
    const yearAgo = new Date(now - 365 * DAY);

    const [visitList, allTimestamps] = await Promise.all([
      storage.getVisits(500),
      storage.getVisitTimestampsSince(null),
    ]);

    const times = allTimestamps.map((timestamp) => new Date(timestamp).getTime());
    const stats = {
      allTime: times.length,
      last24Hours: times.filter((time) => time >= dayAgo.getTime()).length,
      lastWeek: times.filter((time) => time >= weekAgo.getTime()).length,
      lastMonth: times.filter((time) => time >= monthAgo.getTime()).length,
      lastYear: times.filter((time) => time >= yearAgo.getTime()).length,
    };

    const buildSeries = (
      start: number,
      bucketMs: number,
      buckets: number,
      labelFn: (date: Date) => string,
    ) => {
      const counts = new Array<number>(buckets).fill(0);
      for (const time of times) {
        if (time < start) continue;
        const index = Math.min(
          Math.floor((time - start) / bucketMs),
          buckets - 1,
        );
        counts[index]++;
      }
      return counts.map((count, index) => ({
        label: labelFn(new Date(start + index * bucketMs)),
        count,
      }));
    };

    const series = {
      last24Hours: buildSeries(now - 24 * HOUR, HOUR, 24, (date) =>
        date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }),
      ),
      lastWeek: buildSeries(now - 7 * DAY, DAY, 7, (date) =>
        date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      ),
      lastMonth: buildSeries(now - 30 * DAY, DAY, 30, (date) =>
        date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      ),
      lastYear: buildSeries(now - 365 * DAY, (365 / 12) * DAY, 12, (date) =>
        date.toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        }),
      ),
      allTime: (() => {
        const earliest = times.length ? Math.min(...times) : now;
        const span = Math.max(now - earliest, DAY);
        const buckets = Math.min(
          24,
          Math.max(6, Math.ceil(span / (30 * DAY))),
        );
        return buildSeries(earliest, span / buckets, buckets, (date) =>
          date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "2-digit",
          }),
        );
      })(),
    };

    res.json({
      stats,
      series,
      visits: visitList.map((visit) => ({
        id: visit.id,
        email: visit.email,
        visitedAt: visit.visitedAt,
      })),
    });
  } catch (error) {
    req.log.error({ error }, "Failed to load administrative analytics");
    res.status(500).json({ error: "Failed to load visitor data" });
  }
});

export default router;