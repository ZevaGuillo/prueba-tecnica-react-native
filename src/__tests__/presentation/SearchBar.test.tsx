import { SearchBar } from '@/presentation/screens/ProductList/components/SearchBar';
import { render, fireEvent, screen } from '@testing-library/react-native';

describe('SearchBar', () => {
  it('notifica cambios de texto', () => {
    const onChangeText = jest.fn();
    render(<SearchBar value="" onChangeText={onChangeText} testID="search-input" />);

    fireEvent.changeText(screen.getByTestId('search-input'), 'hola');
    expect(onChangeText).toHaveBeenCalledWith('hola');
  });
});
