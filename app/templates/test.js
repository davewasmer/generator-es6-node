import expect from 'must';
import <%= camelModuleName %> from '../src';

describe('<%= camelModuleName %>', function() {
  it('should have a test!', function() {
    expect(<%= camelModuleName %>).to.be.a.function();
  });
});
