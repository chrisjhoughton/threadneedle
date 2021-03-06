var assert             = require('assert');
var _                  = require('lodash');
var validateNotExpects = require('../lib/addMethod/validateNotExpects');


describe('#validateNotExpects', function () {

  it('it should be ok with valid status codes', function () {
    var err = validateNotExpects({
      statusCode: 201
    }, [{
      statusCode: [202]
    }]);
    assert(_.isUndefined(err));

    var err = validateNotExpects({
      statusCode: 201
    }, [{
      statusCode: [202, 204]
    }]);
    assert(_.isUndefined(err));
  });

  it('it should not be ok with invalid status codes', function () {
    var err = validateNotExpects({
      statusCode: 201
    }, [{
      statusCode: [201]
    }]);
    assert(_.isObject(err));
    assert.equal(err.code, 'invalid_response_status_code');
    assert.equal(err.message, 'Invalid response status code');

    var err = validateNotExpects({
      statusCode: 201
    }, [{
      statusCode: [201, 204]
    }]);
    assert(_.isObject(err));
    assert.equal(err.code, 'invalid_response_status_code');
    assert.equal(err.message, 'Invalid response status code');
  });


  it('it should be ok with valid bodies', function () {
    var err = validateNotExpects({
      body: {
        result: 'chris'
      }
    }, [{
      body: ['christopher']
    }]);
    assert(_.isUndefined(err));

    var err = validateNotExpects({
      body: {
        result: 'chris'
      }
    }, [{
      body: ['christopher', 'result2']
    }]);
    assert(_.isUndefined(err));
  });

  it('it should not be ok with invalid bodies', function () {
    var err = validateNotExpects({
      body: {
        result: 'chris'
      }
    }, [{
      body: ['chris']
    }]);
    assert(_.isObject(err));
    assert.equal(err.code, 'invalid_response_body');
    assert.equal(err.message, 'Invalid response body');

    var err = validateNotExpects({
      body: {
        result: 'chris'
      }
    }, [{
      body: ['chris', 'resulttest']
    }]);
    assert(_.isObject(err));
    assert.equal(err.code, 'invalid_response_body');
    assert.equal(err.message, 'Invalid response body');

  });

  it('should not be ok if a function returns an error', function () {
    var err = validateNotExpects({
      body: {
        result: 'chris'
      }
    }, [function (res) {
      return 'Bad things';
    }]);
    assert(_.isObject(err));
    assert.equal(err.code, 'invalid_response_function');
    assert.equal(err.message, 'Bad things');

    var err = validateNotExpects({
      body: {
        result: 'chris'
      }
    }, [function (res) {}, function () {
      return 'Very bad things';
    }]);
    assert(_.isObject(err));
    assert.equal(err.code, 'invalid_response_function');
    assert.equal(err.message, 'Very bad things');
  });



});
