describe('Authentication', function() {
  // Variable for the factory
  var myFactory;

  beforeEach(module('brew_journal.authentication.services'));

  beforeEach(inject(function(Authentication) {
    myFactory = Authentication;
  }))

  it('should be defined', function() {
    expect(myFactory).toBeDefined();
  });
});