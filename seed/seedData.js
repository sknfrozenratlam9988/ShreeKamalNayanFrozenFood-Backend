import { sequelize } from "../config/db.js";
import Admin from "../models/Admin.js";

const seedData = async () => {
  try {
    await sequelize.authenticate();

    console.log("Database connected successfully.");

    const adminEmail =
      process.env.ADMIN_EMAIL ||
      "admin@shreekamalnayanfrozenfood.com";

    const adminPassword =
      process.env.ADMIN_PASSWORD ||
      "change-this-password";

    const adminName =
      process.env.ADMIN_NAME ||
      "Admin";

    const existingAdmin = await Admin.findOne({
      where: {
        email: adminEmail,
      },
    });

    if (existingAdmin) {
      console.log("Admin already exists.");
    } else {
      await Admin.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
      });

      console.log("Admin created successfully.");
    }

    console.log("Product seed skipped.");
    console.log("Products must be created through the ProductForm.");
    console.log("Seed completed successfully.");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedData();