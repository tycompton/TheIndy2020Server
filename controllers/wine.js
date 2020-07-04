const formidable = require('formidable');
const _ = require("lodash");
const fs = require('fs');
const { errorHandler } = require("../helpers/dbErrorHandler");
const Wine = require("../models/wine");

exports.wineById = (req, res, next, id) => {
  Wine.findById(id)
  .populate('type')
  .populate('producer')
  .exec((err, wine) => {
    if (err || !wine) {
      return res.status(400).json({
        error: "Product not found",
      });
    }
    req.wine = wine;
    next();
  });
};

exports.read = (req, res) => {
  req.wine.image = undefined
  return res.json(req.wine);
};

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }
    // check for all fields
    const { name, producer, description, price, type, quantity, delivery } = fields;

    if (
      !name ||
      !producer ||
      !description ||
      !price ||
      !type ||
      !quantity ||
      !delivery
    ) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    let wine = new Wine(fields);

    if (files.image) {
      if (files.image.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1mb in size",
        });
      }
      wine.image.data = fs.readFileSync(files.image.path);
      wine.image.contentType = files.image.type;
    }

    wine.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
  });
};

exports.remove = (req, res) => {
  let wine = req.wine;
  wine.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Product deleted successfully",
    });
  });
};

exports.update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }
    // check for all fields
    // const { name, description, price, category, quantity, delivery } = fields;

    // if (
    //   !name ||
    //   !description ||
    //   !price ||
    //   !category ||
    //   !quantity ||
    //   !delivery
    // ) {
    //   return res.status(400).json({
    //     error: "All fields are required",
    //   });
    // }

    let wine = req.wine;
    wine = _.extend(wine, fields)

    if (files.image) {
      if (files.image.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1mb in size",
        });
      }
      wine.image.data = fs.readFileSync(files.image.path);
      wine.image.contentType = files.image.type;
    }

    wine.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
  });
};

// by Sell = /products?sortBy=sold&order=desc&limit=4

// by Arrival = /products?sortBy=createdAt&order=desc&limit=4
exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Wine.find()
    .select("-image")
    .populate('type')
    .populate('producer')
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, wines) => {
      if (err) {
        return res.status(400).json({
          error: "Product not found",
        });
      }
      res.json(wines);
    });
};


exports.listRelated = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Wine.find({ _id: { $ne: req.wine }, type: req.wine.type })
    .limit(limit)
    .populate("type", "_id name")
    .populate("producer", "_id name")
    .exec((err, wines) => {
      if (err) {
        return res.status(400).json({
          error: "Products not found",
        });
      }
      res.json(wines);
    });
}; 


exports.listTypes = (req, res) => {
  Wine.distinct("type", {}, (err, types) => {
    if (err) {
      return res.status(400).json({
        error: "types not found",
      });
    }
    res.json(types)
  })
}

 
exports.listBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 500;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }
 
  Wine.find(findArgs) 
    .select("-image")
    .populate("type")
    .populate("producer")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Products not found",
        });
      }
      res.json({
        size: data.length,
        data,
      });
    });
};

exports.image = (req, res, next) => {
  if (req.wine.image.data) {
    res.set("Content-Type", req.wine.image.contentType);
    return res.send(req.wine.image.data);
  }
  next();
}; 

exports.listSearch = (req, res) => {
  // create query object to hold source value and category value
  const query = {};
  // assing value to query.name
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: "i" };
    // assign category value to query.category
    if (req.query.type && req.query.type != "All") {
      query.type = req.query.type;
    }
    // find product based on query object with 2 properties
    Wine.find(query, (err, wines) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(wines);
    }).select('-image');
  }
}; 


exports.decreaseQuantity = (req, res, next) => {
  let bulkOps = req.body.order.wines.map((item) => {
    return {
      updateOne: {
        filter: { _id: item._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });
  
  Wine.bulkWrite(bulkOps, {}, (error, wines) => {
    if (error) {
      return res.status(400).json({
        error: "Could not update product",
      });
    }
    next();
  });
};