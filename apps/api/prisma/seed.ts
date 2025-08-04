import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create some example sessions
  const session1 = await prisma.session.create({
    data: {
      name: "Demo House Project",
      sceneData: {
        objects: {
          obj_1: {
            id: "obj_1",
            type: "box",
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
            color: "#ff6b6b",
          },
          obj_2: {
            id: "obj_2",
            type: "sphere",
            position: [2, 1, 0],
            rotation: [0, 0, 0],
            scale: [0.5, 0.5, 0.5],
            color: "#4ecdc4",
          },
        },
        backgroundColor: "#f0f0f0",
        gridSize: 10,
      },
    },
  });

  const session2 = await prisma.session.create({
    data: {
      name: "Car Design Prototype",
      sceneData: {
        objects: {
          car_body: {
            id: "car_body",
            type: "box",
            position: [0, 0.5, 0],
            rotation: [0, 0, 0],
            scale: [4, 1, 2],
            color: "#ff4757",
          },
          wheel_1: {
            id: "wheel_1",
            type: "cylinder",
            position: [-1.5, 0, 1],
            rotation: [0, 0, Math.PI / 2],
            scale: [0.5, 0.3, 0.5],
            color: "#2f3542",
          },
        },
      },
    },
  });

  const session3 = await prisma.session.create({
    data: {
      name: "Empty Workspace",
      sceneData: {
        objects: {},
      },
    },
  });

  console.log("✅ Created sample sessions:");
  console.log(`📦 ${session1.name} - ID: ${session1.id}`);
  console.log(`🚗 ${session2.name} - ID: ${session2.id}`);
  console.log(`⭕ ${session3.name} - ID: ${session3.id}`);
  console.log("");
  console.log("🔗 You can access these sessions at:");
  console.log(`   /session/${session1.id}`);
  console.log(`   /session/${session2.id}`);
  console.log(`   /session/${session3.id}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
