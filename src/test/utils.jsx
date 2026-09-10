import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Render a component tree inside a MemoryRouter so hooks like useNavigate
// and <Link> work in tests. Pass `route` to set the starting URL.
export function renderWithRouter(ui, { route = '/' } = {}) {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
