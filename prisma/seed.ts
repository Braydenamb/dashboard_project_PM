import bcrypt from "bcryptjs";
import { subDays, subHours } from "date-fns";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

const demoEmail = process.env.DEMO_EMAIL ?? "demo@acme-ai.local";
const demoPassword = process.env.DEMO_PASSWORD ?? "DemoPass123!";

async function main() {
  await prisma.activity.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.metricSnapshot.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash(demoPassword, 10);

  const users = await prisma.$transaction([
    prisma.user.create({
      data: {
        name: "Alex Morgan",
        email: demoEmail,
        role: UserRole.ADMIN,
        status: "Active",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop",
        passwordHash,
        lastActiveAt: subHours(new Date(), 1),
      },
    }),
    prisma.user.create({
      data: {
        name: "Noah Patel",
        email: "noah@acme-ai.local",
        role: UserRole.ANALYST,
        status: "Active",
        passwordHash: await bcrypt.hash("Analyst123!", 10),
        lastActiveAt: subHours(new Date(), 3),
      },
    }),
    prisma.user.create({
      data: {
        name: "Mia Chen",
        email: "mia@acme-ai.local",
        role: UserRole.SUPPORT,
        status: "Away",
        passwordHash: await bcrypt.hash("Support123!", 10),
        lastActiveAt: subHours(new Date(), 10),
      },
    }),
    prisma.user.create({
      data: {
        name: "Ethan Brooks",
        email: "ethan@acme-ai.local",
        role: UserRole.ANALYST,
        status: "Busy",
        passwordHash: await bcrypt.hash("Analytics123!", 10),
        lastActiveAt: subHours(new Date(), 20),
      },
    }),
  ]);

  const activitySeeds = [
    ["Model", "Fine-tuned revenue predictor model v3.2", users[1]?.id],
    ["Alert", "Churn rate anomaly flagged in enterprise segment", users[2]?.id],
    ["Deploy", "Production deployment completed for metrics API", users[0]?.id],
    ["Sync", "CRM integration synced 1,284 contacts", users[3]?.id],
    ["Incident", "Payment webhook latency normalized", users[0]?.id],
  ] as const;

  await prisma.activity.createMany({
    data: activitySeeds.map(([type, message, userId], index) => ({
      type,
      message,
      userId,
      createdAt: subHours(new Date(), index * 2 + 1),
    })),
  });

  await prisma.notification.createMany({
    data: [
      {
        title: "AI forecast complete",
        description: "30-day MRR projection refreshed successfully.",
        level: "info",
        isRead: false,
      },
      {
        title: "Usage threshold reached",
        description: "Team Orion exceeded 85% of monthly token quota.",
        level: "warning",
        isRead: false,
      },
      {
        title: "Security review scheduled",
        description: "Quarterly compliance audit starts tomorrow at 09:00.",
        level: "success",
        isRead: true,
      },
    ],
  });

  const metricData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const trendFactor = i / 29;

    return {
      date,
      revenue: 92000 + trendFactor * 28000 + Math.sin(i / 3) * 2800,
      mrr: 61000 + trendFactor * 13000 + Math.cos(i / 5) * 1500,
      churnRate: 2.8 - trendFactor * 0.7 + Math.sin(i / 4) * 0.1,
      activeUsers: Math.round(1120 + trendFactor * 320 + Math.cos(i / 2) * 25),
      ticketsResolved: Math.round(72 + trendFactor * 24 + Math.sin(i / 3) * 6),
      conversionRate: 3.1 + trendFactor * 0.9 + Math.cos(i / 6) * 0.15,
    };
  });

  await prisma.metricSnapshot.createMany({
    data: metricData,
  });

  console.log("✅ Seed complete");
  console.log(`Demo login: ${demoEmail} / ${demoPassword}`);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
