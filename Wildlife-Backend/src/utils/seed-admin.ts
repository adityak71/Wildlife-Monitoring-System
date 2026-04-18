import prisma from "./prisma.client";
import bcrypt from "bcryptjs";
import logger from "./logger";

export const seedAdminUser = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@forestwatch.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123456";
    const adminName = process.env.ADMIN_NAME || "Super Admin";

    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);

      await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: adminName,
          role: "ADMIN",
          isVerified: true,
          isActive: true,
        },
      });

      logger.info(`✅ Admin user created: ${adminEmail}`);
    } else {
      logger.info(`✅ Admin user already exists: ${adminEmail}`);
    }
  } catch (error) {
    logger.error("Error seeding admin user:", error);
  }
};
