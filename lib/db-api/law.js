/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Law = mongoose.model('Law');
var log = require('debug')('db-api:law');

/**
 * Get all laws
 *
 * @param {Function} fn callback function
 *   - 'err' error found on query or `null`
 *   - 'laws' list items found or `undefined`
 * @return {Module} `law` module
 * @api public
 */

exports.all = function all(fn) {
  log('Looking for all laws.')

  Law.find(function (err, comments) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    };

    log('Delivering laws %j', mapByProperty(proposals, 'id'));
    fn(null, proposals);
  });

  return this;
};

/**
 * Creates law
 *
 * @param {Object} data to create law
 * @param {Function} fn callback function
 *   - 'err' error found on query or `null`
 *   - 'law' item created or `undefined`
 * @return {Module} `law` module
 * @api public
 */

exports.create = function create(data, fn) {
  log('Creating new law %j', data);
  
  var law = new Law(data);

  law.save(function (err, saved) {
    if (err) {
      if (11000 == err.code) {
        log('Attempt duplication.');
        exports.searchOne(law.lawId, fn);
      } else {
        log('Found error %j', err);
        fn(err);
      }

      return;
    };

    log('Delivering law %j', saved);
    fn(null, saved);
  });

  return this;
};

/**
 * Search single law from lawId
 *
 * @param {String} lawId string to search by `lawId`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'law' single law object found or `undefined`
 * @return {Module} `law` module
 * @api public
 */

exports.searchOne = function searchByLawId(lawId, fn) {
  var query = { lawId: lawId };

  log('Searching for single law matching %j', query);
  Law.findOne(query, function (err, law) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    }

    log('Delivering law %j', law);
    fn(null, law);
  })

  return this;
};
/**
 * Get Law form `id` string or `ObjectId`
 *
 * @param {String|ObjectId} id Law's `id`
 * @param {Function} fn callback function
 *   - 'err' error found while process or `null`
 *   - 'law' found item or `undefined`
 * @api public
 */

exports.get = function get(id, fn) {
  log('Looking for law %s', id);

  Law
  .findById(id)
  .exec(function (err, law) {
    if (err) {
      log('Found error %j', err);
      return fn(err);
    };

    log('Delivering law %j', proposal);
    fn(null, proposal);
  });
};

/**
 * Map array of objects by `property`
 *
 * @param {Array} source array of objects to map
 * @param {String} property to map from objects
 * @return {Array} array of listed properties
 * @api private
 */

function mapByProperty (source, property) {
  return source.map(function(item) { return item[prop]; });
};