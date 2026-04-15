import { DetailField } from '@/presentation/screens/ProductDetail/components/DetailField';
import { render, screen } from '@testing-library/react-native';

describe('DetailField', () => {
  it('muestra etiqueta y valor', () => {
    render(<DetailField label="Campo" value="Valor" />);
    expect(screen.getByText('Campo')).toBeTruthy();
    expect(screen.getByText('Valor')).toBeTruthy();
  });
});
