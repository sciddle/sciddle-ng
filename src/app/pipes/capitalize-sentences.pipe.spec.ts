import { CapitalizeSentencesPipe } from './capitalize-sentences.pipe';

describe('CapitalizeSentencesPipe', () => {
  it('create an instance', () => {
    const pipe = new CapitalizeSentencesPipe();
    expect(pipe).toBeTruthy();
  });
});
