import { hrefProductDetail, hrefProductEdit, hrefProductNew } from '@/presentation/navigation/types';

describe('navigation types', () => {
  it('genera hrefs codificados', () => {
    expect(hrefProductNew()).toBe('/product/new');
    expect(hrefProductDetail('a b')).toBe('/product/a%20b');
    expect(hrefProductEdit('x')).toBe('/product/edit/x');
  });
});
