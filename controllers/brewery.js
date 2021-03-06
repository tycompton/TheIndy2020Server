const Brewery = require("../models/brewery");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.breweryById = (req, res, next, id) => {
  Brewery.findById(id).exec((err, brewery) => {
    if (err || !brewery) {
      return res.status(400).json({
        error: "Brewery does not exist",
      });
    }
    req.brewery = brewery;
    next();
  });
};

exports.create = (req, res) => {
  const brewery = new Brewery(req.body);
  brewery.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({ data });
  });
}; 

exports.read = (req, res) => {
  return res.json(req.brewery);
};

exports.update = (req, res) => {
  const brewery = req.brewery;
  brewery.name = req.body.name;
  brewery.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.remove = (req, res) => {
  const brewery = req.brewery;
  brewery.remove((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Brewery deleted"
    });
  });
};
 
exports.list = (req, res) => {
  Brewery.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};