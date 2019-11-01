const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Interaction } = require("../../../models/interaction");
const moment = require("moment");

router.get("/details/", async (req, res) => {
  const interactions = await Interaction.aggregate([
    {
      $match: {
        agentId: mongoose.Types.ObjectId(req.user._id),
        tenantId: mongoose.Types.ObjectId(req.tenantId)
      }
    },
    {
      $lookup: {
        from: "types", // collection to join
        localField: "typeId", // field from categories collection
        foreignField: "_id", // field from subcategories collection
        as: "type"
      }
    },
    {
      $unwind: "$type"
    },
    {
      $lookup: {
        from: "users", // collection to join
        localField: "agentId", // field from categories collection
        foreignField: "_id", // field from subcategories collection
        as: "agent"
      }
    },
    {
      $unwind: "$agent"
    },
    {
      $lookup: {
        from: "skillgroups", // collection to join
        localField: "skillgroupId", // field from categories collection
        foreignField: "_id", // field from subcategories collection
        as: "skillgroup"
      }
    },
    {
      $unwind: "$skillgroup"
    },
    {
      $lookup: {
        from: "customers", // collection to join
        localField: "customerId", // field from categories collection
        foreignField: "_id", // field from subcategories collection
        as: "customer"
      }
    },
    {
      $unwind: "$customer"
    }
  ]);
  return res.send(interactions);
});

// Get all interactions history in range
router.get("/details/:range", async (req, res) => {
  //console.log("Get user detailed history API");
  const dateRange = getDateRange(req.params.range);
  if (!dateRange)
    return res
      .status(404)
      .send(
        "Invalid range, you can define today , yesterday, week , month , year"
      );

  const interactions = await Interaction.aggregate([
    {
      $match: {
        creationDate: {
          $gte: new Date(dateRange.start),
          $lte: new Date(dateRange.end)
        },
        agentId: mongoose.Types.ObjectId(req.user._id),
        tenantId: mongoose.Types.ObjectId(req.tenantId)
      }
    },
    {
      $lookup: {
        from: "types", // collection to join
        localField: "typeId", // field from categories collection
        foreignField: "_id", // field from subcategories collection
        as: "type"
      }
    },
    {
      $unwind: "$type"
    },
    {
      $lookup: {
        from: "users", // collection to join
        localField: "agentId", // field from categories collection
        foreignField: "_id", // field from subcategories collection
        as: "agent"
      }
    },
    {
      $unwind: "$agent"
    },
    {
      $lookup: {
        from: "skillgroups", // collection to join
        localField: "skillgroupId", // field from categories collection
        foreignField: "_id", // field from subcategories collection
        as: "skillgroup"
      }
    },
    {
      $unwind: "$skillgroup"
    },
    {
      $lookup: {
        from: "customers", // collection to join
        localField: "customerId", // field from categories collection
        foreignField: "_id", // field from subcategories collection
        as: "customer"
      }
    },
    {
      $unwind: "$customer"
    }
  ]);
  return res.send(interactions);
});

//Get all interactions history summary in range
router.get("/summary/:range", async (req, res) => {
  //  console.log("Get user summary history API");
  const dateRange = getDateRange(req.params.range);
  if (!dateRange)
    return res
      .status(404)
      .send(
        "Invalid range, you can define today , yesterday, week , month , year"
      );
  const result = await Interaction.aggregate([
    {
      $match: {
        creationDate: {
          $gte: new Date(dateRange.start),
          $lte: new Date(dateRange.end)
        },
        agentId: mongoose.Types.ObjectId(req.user._id),
        tenantId: mongoose.Types.ObjectId(req.tenantId)
      }
    },
    {
      $lookup: {
        from: "types", // collection to join
        localField: "typeId", // field from categories collection
        foreignField: "_id", // field from subcategories collection
        as: "type"
      }
    },
    {
      $unwind: "$type"
    },
    {
      $group: {
        _id: "$type.channel", //"$creationDate"
        count: { $sum: 1 }
      }
    }
  ]);
  return res.send(result);
});
router.get("/graph/:range", async (req, res) => {
  //console.log("Get user summary history API");
  const dateRange = getDateRange(req.params.range);
  if (!dateRange)
    return res
      .status(404)
      .send(
        "Invalid range, you can define today , yesterday, week , month , year"
      );
  const result = await Interaction.aggregate([
    {
      $match: {
        creationDate: {
          $gte: new Date(dateRange.start),
          $lte: new Date(dateRange.end)
        },
        agentId: mongoose.Types.ObjectId(req.user._id),
        tenantId: mongoose.Types.ObjectId(req.tenantId)
      }
    },
    {
      $lookup: {
        from: "types", // collection to join
        localField: "typeId", // field from categories collection
        foreignField: "_id", // field from subcategories collection
        as: "type"
      }
    },
    {
      $unwind: "$type"
    },
    {
      $group: {
        _id: "$creationDate", //
        count: { $sum: 1 }
      }
    }
  ]);
  return res.send(result);
});

const getDateRange = range => {
  switch (range) {
    case "today":
      return {
        start: moment().startOf("day"),
        end: moment().endOf("day")
      };
    case "yesterday":
      return {
        start: moment()
          .subtract(1, "days")
          .startOf("day"),
        end: moment()
          .subtract(1, "days")
          .endOf("day")
      };
    case "lastweek":
      return {
        start: moment()
          .subtract(1, "weeks")
          .startOf("week"),
        end: moment()
          .subtract(1, "weeks")
          .endOf("week")
      };

    case "lastmonth":
      return {
        start: moment()
          .subtract(1, "months")
          .startOf("month"),
        end: moment()
          .subtract(1, "months")
          .endOf("month")
      };
    case "lastyear":
      return {
        start: moment()
          .subtract(1, "years")
          .startOf("year"),
        end: moment()
          .subtract(1, "years")
          .endOf("year")
      };
    case "week":
    case "month":
    case "year":
      return {
        start: moment().startOf(range),
        end: moment().endOf(range)
      };
    default:
      break;
  }
};
module.exports = router;
