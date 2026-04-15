import { ProductLogoDisplay } from '@/presentation/screens/ProductDetail/components/ProductLogoDisplay';
import { render, screen } from '@testing-library/react-native';

jest.mock('expo-image', () => ({
  Image: 'Image',
}));

describe('ProductLogoDisplay', () => {
  it('expone etiqueta de accesibilidad', () => {
    render(<ProductLogoDisplay logo="https://example.com/x.png" productName="Mi producto" />);
    expect(screen.getByLabelText('Logo del producto Mi producto')).toBeTruthy();
  });

  it('muestra texto cuando no hay URL absoluta', () => {
    render(<ProductLogoDisplay logo="local.png" productName="P" />);
    expect(screen.getByText('local.png')).toBeTruthy();
  });
});
