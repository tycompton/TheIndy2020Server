const Producer = require("../models/producer");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.producerById = (req, res, next, id) => {
  Producer.findById(id).exec((err, producer) => {
    if (err || !producer) {
      return res.status(400).json({
        error: "Producer does not exist",
      });
    }
    req.producer = producer;
    next();
  });
};

exports.create = (req, res) => {
  const producer = new Producer(req.body);
  producer.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({ data });
  });
}; 
 
exports.read = (req, res) => {
  return res.json(req.producer);
};

exports.update = (req, res) => {
  const producer = req.producer;
  producer.name = req.body.name;
  producer.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.remove = (req, res) => {
  const producer = req.producer;
  producer.remove((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Producer deleted"
    });
  });
};

exports.list = (req, res) => {
  Producer.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
}; 