import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Layout } from "@/components/layout/Layout";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

interface VisitEntry {
  id: number;
  email: string | null;
  visitedAt: string;
}

interface SeriesPoint {
  label: string;
  count: number;
}

interface AdminVisitsData {
  stats: Record<Tab, number>;
  series: Record<Tab, SeriesPoint[]>;
  visits: VisitEntry[];
}

type Tab = "last24Hours" | "lastWeek" | "lastMonth" | "lastYear" | "allTime";

const TAB_META: { key: Tab; label: string; statLabel: string }[] = [
  { key: "last24Hours", label: "Last 24 Hours", statLabel: "Last 24 h" },
  { key: "lastWeek", label: "Last 7 Days", statLabel: "Last 7 d" },
  { key: "lastMonth", label: "Last 30 Days", statLabel: "Last 30 d" },
  { key: "lastYear", label: "Last 12 Months", statLabel: "Last 12 mo" },
  { key: "allTime", label: "All Time", statLabel: "All Time" },
];

function useAdminVisits() {
  return useQuery<AdminVisitsData>({
    queryKey: ["admin-visits"],
    queryFn: async () => {
      const response = await fetch(`${basePath}/api/admin/visits`);
      if (!response.ok) throw new Error(`${response.status}`);
      return response.json();
    },
    staleTime: 30_000,
    retry: false,
  });
}

export default function Administrative() {
  const { data, isLoading, isError, error } = useAdminVisits();
  const [activeTab, setActiveTab] = useState<Tab>("lastWeek");

  return (
    <Layout>
      <div className="p-8 max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-semibold tracking-tight">
            Administrative
          </h1>
          <p className="text-muted-foreground mt-1">
            Historical Google login activity and access analytics for this course.
          </p>
        </div>

        {isLoading && (
          <div className="py-24 text-center text-muted-foreground animate-pulse">
            Loading analytics…
          </div>
        )}

        {isError && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-center">
            <p className="font-medium text-destructive">
              Administrative analytics could not be loaded
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Error: {(error as Error).message}
            </p>
          </div>
        )}

        {data && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {TAB_META.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`rounded-lg border p-4 text-left transition-colors ${
                    activeTab === tab.key
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:bg-secondary"
                  }`}
                >
                  <p className="text-2xl font-semibold tabular-nums">
                    {data.stats[tab.key]}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {tab.statLabel}
                  </p>
                </button>
              ))}
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex flex-wrap gap-1 mb-6">
                {TAB_META.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.key
                        ? "bg-primary text-primary-foreground"
                        : "border border-border hover:bg-secondary"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <ChartPanel
                series={data.series[activeTab]}
                title={TAB_META.find((tab) => tab.key === activeTab)!.label}
              />
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-semibold text-base">Login History</h2>
                <p className="text-sm text-muted-foreground">
                  Most recent {data.visits.length} recorded sign-ins, newest first
                </p>
              </div>

              {data.visits.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-sm">
                  No historical sign-ins are recorded.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                          Gmail
                        </th>
                        <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                          Date &amp; Time
                        </th>
                        <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                          Relative
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.visits.map((visit, index) => (
                        <tr
                          key={visit.id}
                          className={`border-b border-border last:border-0 ${
                            index % 2 === 0 ? "" : "bg-muted/10"
                          }`}
                        >
                          <td className="px-6 py-3 font-mono text-xs">
                            {visit.email ?? (
                              <span className="text-muted-foreground italic">
                                unknown
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-3 tabular-nums text-xs">
                            {new Date(visit.visitedAt).toLocaleString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </td>
                          <td className="px-6 py-3 text-muted-foreground text-xs">
                            {relativeTime(visit.visitedAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

function ChartPanel({
  series,
  title,
}: {
  series: SeriesPoint[];
  title: string;
}) {
  const hasData = series.some((point) => point.count > 0);

  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-4">
        {title} — historical logins
      </h3>
      {hasData ? (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={series}
            margin={{ top: 4, right: 4, left: -16, bottom: 4 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: 12,
              }}
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
              formatter={(value: number) => [value, "Logins"]}
            />
            <Bar
              dataKey="count"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
          No historical sign-ins in this period.
        </div>
      )}
    </div>
  );
}

function relativeTime(iso: string): string {
  const difference = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(difference / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}