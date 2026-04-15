import {
  DeleteConfirmModal,
  DeleteConfirmModalSurface,
} from '@/presentation/screens/ProductDetail/components/DeleteConfirmModal';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/** Sin métricas iniciales, el provider no monta hijos en entornos sin nativo (p. ej. Jest). */
const safeAreaInitialMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function wrapper({ children }: { children: ReactNode }) {
  return (
    <SafeAreaProvider initialMetrics={safeAreaInitialMetrics}>{children}</SafeAreaProvider>
  );
}

const surfaceProps = {
  productName: 'Prueba producto',
  productId: 'p1',
  onCancel: jest.fn(),
  onConfirm: jest.fn(),
} as const;

describe('DeleteConfirmModal', () => {
  it('no muestra el mensaje cuando visible es false', () => {
    render(
      <DeleteConfirmModal
        visible={false}
        productName="Prueba"
        productId="p1"
        onCancel={jest.fn()}
        onConfirm={jest.fn()}
      />,
      { wrapper },
    );
    expect(
      screen.queryByText(/¿Estás seguro de eliminar el producto/),
    ).toBeNull();
  });

  it('Cancelar y Confirmar llaman a los handlers', async () => {
    const onCancel = jest.fn();
    const onConfirm = jest.fn().mockResolvedValue(undefined);

    render(
      <DeleteConfirmModalSurface
        {...surfaceProps}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />,
      { wrapper },
    );

    expect(
      screen.getByText('¿Estás seguro de eliminar el producto Prueba producto?'),
    ).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Cancelar'));
    expect(onCancel).toHaveBeenCalled();

    fireEvent.press(screen.getByLabelText('Confirmar'));
    await waitFor(() => expect(onConfirm).toHaveBeenCalled());
  });

  it('muestra error del servidor cuando se pasa errorMessage', () => {
    render(
      <DeleteConfirmModalSurface
        {...surfaceProps}
        productName="X"
        errorMessage="Fallo de red simulado"
      />,
      { wrapper },
    );
    expect(screen.getByText('Fallo de red simulado')).toBeTruthy();
  });

  it('cierra al pulsar el fondo', () => {
    const onCancel = jest.fn();
    render(
      <DeleteConfirmModalSurface {...surfaceProps} onCancel={onCancel} />,
      { wrapper },
    );
    fireEvent.press(screen.getByLabelText('Cerrar sin eliminar'));
    expect(onCancel).toHaveBeenCalled();
  });
});
