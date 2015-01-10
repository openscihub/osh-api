var expect = require('expect.js');

describe('lib', function() {
  describe('pick()', function() {
    var pick;

    before(function() {
      pick = require('./pick');
    });

    it('should work', function() {
      var o = pick({a: 1, b: 2}, ['a']);
      expect(o).to.eql({a: 1});
    });

    it('should not add undefined key', function() {
      var o = pick({a: 1, b: 2}, ['a', 'c']);
      expect(o).to.eql({a: 1});
    });
  });
});
