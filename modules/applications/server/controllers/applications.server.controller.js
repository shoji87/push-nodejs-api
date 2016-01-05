'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Application = mongoose.model('Application'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a application
 */
exports.create = function (req, res) {
  var application = new Application(req.body);
  application.user = req.user;

  application.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(application);
    }
  });
};

/**
 * Show the current application
 */
exports.read = function (req, res) {
  res.json(req.application);
};

/**
 * Update a application
 */
exports.update = function (req, res) {
  var application = req.application;

  application.title = req.body.title;
  application.content = req.body.content;

  application.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(application);
    }
  });
};

/**
 * Delete an application
 */
exports.delete = function (req, res) {
  var application = req.application;

  application.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(application);
    }
  });
};

/**
 * List of Applications
 */
exports.list = function (req, res) {
  Application.find().sort('-created').populate('user', 'displayName').exec(function (err, applications) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(applications);
    }
  });
};

/**
 * Application middleware
 */
exports.applicationByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Application is invalid'
    });
  }

  Application.findById(id).populate('user', 'displayName').exec(function (err, application) {
    if (err) {
      return next(err);
    } else if (!application) {
      return res.status(404).send({
        message: 'No application with that identifier has been found'
      });
    }
    req.application = application;
    next();
  });
};