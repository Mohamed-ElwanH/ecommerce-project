const mongoose = require("mongoose");
const Order = require("../models/order.model");

exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const matchStage = {
      status: {
        $nin: ["canceled by user", "canceled by admin", "rejected", "refunded"],
      },
    };
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    const summary = await Order.aggregate([
      { $match: matchStage }, 

      { $unwind: "$products" },

      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },

      {
        $addFields: {
          lineTotal: {
            $multiply: ["$products.priceAtOrderTime", "$products.quantity"],
          },
        },
      },

      {
        $facet: {
          // 1- total sales
          overallStats: [
            {
              $group: {
                _id: null,
                totalSalesAmount: { $sum: "$lineTotal" },
                totalQuantitySold: { $sum: "$products.quantity" },
                numberOfOrders: { $addToSet: "$_id" }, 
              },
            },
            {
              $project: {
                _id: 0,
                totalSalesAmount: 1,
                totalQuantitySold: 1,
                numberOfOrders: { $size: "$numberOfOrders" }, 
              },
            },
          ],

          topProducts: [
            {
              $group: {
                _id: "$productDetails._id",
                name: { $first: "$productDetails.name" },
                revenue: { $sum: "$lineTotal" },
                totalQuantity: { $sum: "$products.quantity" },
              },
            },
            { $sort: { revenue: -1 } },
            { $limit: 5 }, 
          ],

          topUsers: [
            {
              $group: {
                _id: "$user._id",
                name: { $first: "$user.name" },
                totalSpent: { $sum: "$lineTotal" },
                totalOrders: { $addToSet: "$_id" },
              },
            },
            {
              $project: {
                name: 1,
                totalSpent: 1,
                totalOrders: { $size: "$totalOrders" },
              },
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 5 },
          ],

          monthlySales: [
            {
              $group: {
                _id: {
                  year: { $year: "$createdAt" },
                  month: { $month: "$createdAt" },
                },
                totalRevenue: { $sum: "$lineTotal" },
                totalQuantity: { $sum: "$products.quantity" },
                totalOrders: { $addToSet: "$_id" },
              },
            },
            {
              $project: {
                _id: 1,
                totalRevenue: 1,
                totalQuantity: 1,
                totalOrders: { $size: "$totalOrders" },
              },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
          ],
        },
      },
    ]);

    res.status(200).json({
      message: `Sales report from ${startDate || "the beginning"} to ${endDate || "now"}`,
      data: summary[0],
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
