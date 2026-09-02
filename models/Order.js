import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customerName: { type: DataTypes.STRING, allowNull: false },
    customerPhone: { type: DataTypes.STRING, allowNull: false },
    customerAddress: { type: DataTypes.TEXT, allowNull: false },
    notes: { type: DataTypes.TEXT, allowNull: true },
    items: {
      // Snapshot of cart items at order time: [{ productId, name, price, quantity, unit }]
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    totalAmount: { type: DataTypes.FLOAT, allowNull: false },
    status: {
      type: DataTypes.ENUM("Pending", "Confirmed", "Out for Delivery", "Delivered", "Cancelled"),
      allowNull: false,
      defaultValue: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

Order.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = String(values.id);
  return values;
};

export default Order;