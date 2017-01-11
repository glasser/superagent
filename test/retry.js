var setup = require('./support/setup');
var base = setup.uri;
var assert = require('assert');
var request = require('../');

describe('.retry(count)', function(){
  this.timeout(15000);

  it('should handle server error after repeat attempt', function(done){
    request
    .get(base + '/error')
    .retry(2)
    .end(function(err, res){
      assert(err, 'expected an error');
      assert.equal(2, err.retries, 'expected an error with .attempts');
      assert.equal(500, err.status, 'expected an error status of 500');
      done();
    });
  });

  it('should handle successful request after repeat attempt from server error', function(done){
    request
    .get(base + '/error/ok')
    .retry(2)
    .end(function(err, res){
      assert(res.ok, 'response should be ok');
      assert(res.text, 'res.text');
      done();
    });
  });

  it('should handle server timeout error after repeat attempt', function(done) {
    request
    .get(base + '/delay/150')
    .timeout(50)
    .retry(2)
    .end(function(err, res){
      assert(err, 'expected an error');
      assert.equal(2, err.retries, 'expected an error with .attempts');
      assert.equal('number', typeof err.timeout, 'expected an error with .timeout');
      assert.equal('ECONNABORTED', err.code, 'expected abort error code')
      done();
    });
  });

  it('should handle successful request after repeat attempt from server timeout', function(done) {
    request
    .get(base + '/delay/150/ok')
    .timeout(50)
    .retry(2)
    .end(function(err, res){
      assert(res.ok, 'response should be ok');
      assert(res.text, 'res.text');
      done();
    });
  });

  it('should handle successful redirected request after repeat attempt from server error');
})