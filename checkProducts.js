import { sequelize } from "./config/db.js";
import Product from "./models/Product.js";

const checkProducts = async () => {
  try {
    await sequelize.authenticate();

    const products = await Product.findAll({
      attributes: [
        "id",
        "name",
        "category",
        "thumbnail",
        "images",
        "isFeatured",
        "isActive",
      ],
      order: [["id", "ASC"]],
    });

    console.log("\n===== EXISTING PRODUCTS =====\n");

    products.forEach((product) => {
      console.log({
        id: product.id,
        name: product.name,
        category: product.category,
        thumbnail: product.thumbnail,
        images: product.images,
        isFeatured: product.isFeatured,
        isActive: product.isActive,
      });
    });

    console.log(`\nTotal products: ${products.length}`);
  } catch (error) {
    console.error("Database check error:", error);
  } finally {
    await sequelize.close();
  }
};

checkProducts();