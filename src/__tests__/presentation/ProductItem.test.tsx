import { ProductItem } from '@/presentation/screens/ProductList/components/ProductItem';
import { sampleProduct } from '../fixtures/financialProduct';
import { render, fireEvent, screen } from '@testing-library/react-native';

describe('ProductItem', () => {
  it('dispara onPress', () => {
    const onPress = jest.fn();
    const p = sampleProduct({ id: 'p1', name: 'Nombre visible' });
    render(<ProductItem product={p} onPress={onPress} />);

    fireEvent.press(screen.getByLabelText(/Abrir detalle de Nombre visible/));
    expect(onPress).toHaveBeenCalled();
  });
});
