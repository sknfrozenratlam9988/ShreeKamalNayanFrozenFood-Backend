import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    category: {
      type: DataTypes.ENUM(
        "Frozen Vegetables",
        "Frozen Fruits",
        "Ready To Eat",
        "Other"
      ),
      allowNull: false,
      defaultValue: "Frozen Vegetables",
    },

    shortDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    unit: {
      type: DataTypes.STRING,
      defaultValue: "500 g pack",
    },

    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
    },

    images: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },

    thumbnail: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    nutrition: {
      type: DataTypes.JSONB,
      defaultValue: {
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        fiber: "",
      },
    },

    features: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },

    storageInstructions: {
      type: DataTypes.STRING,
      defaultValue:
        "Keep frozen at -18°C. Do not refreeze after thawing.",
    },

    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 4.5,
    },
  },
  {
    timestamps: true,
  }
);

Product.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = String(values.id);
  return values;
};

export default Product;