import { expect } from 'chai';

jest.setTimeout(30000);

describe('# test core', function () {
  it('## createLocaleMessages', () => {
    expect('hello').equal('hello');
  });
});
