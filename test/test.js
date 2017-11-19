var assert = require('assert');

const jutil = require('../js/util');
const fuzzytimeinput = require('fuzzytimeinput');
describe('Util', function() {
  it('Autocomplete should not match a null or blank input', function() {
    assert.equal(jutil.autoComplete(null,['hello']),null);
    assert.equal(jutil.autoComplete('',['hello']),null);
  });
  it('Time', function(){
    assert.equal(fuzzytimeinput(''),null);
    assert.equal(fuzzytimeinput(null),null);
  });
});