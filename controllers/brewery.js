const Brewery = require("../models/brewery");
const { errorHandler } = require("../helpers/dbErrorHandler");

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