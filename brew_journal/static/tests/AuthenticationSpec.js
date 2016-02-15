describe('Authentication', function() {
  beforeEach(module('brew_journal.authentication.services'));

  it('should be defined', inject(function(Authentication) {
    expect(Authentication).toBeDefined();
  }));
});