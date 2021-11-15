import { expect } from 'chai';

jest.setTimeout(30000);

describe('# test', function () {
  it('## main', () => {
    expect('hello').equal('hello');
  });
});
