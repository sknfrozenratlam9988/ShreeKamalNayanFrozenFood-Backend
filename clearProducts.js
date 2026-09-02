import { sequelize } from "./config/db.js";
import Product from "./models/Product.js";

const clearProducts = async () => {
  try {
    await sequelize.authenticate();

    console.log("Database connected successfully.");

    const count = await Product.count();

    console.log(`Existing products: ${count}`);

    await Product.destroy({
      where: {},
      truncate: true,
      cascade: true,
    });

    console.log("All products deleted successfully.");
    console.log("Product database is now empty.");
  } catch (error) {
    console.error("Error clearing products:", error);
  } finally {
    await sequelize.close();
  }
};

clearProducts();