import userEvent from '@testing-library/user-event';
import { NewHabitForm } from '../../components/Header/NewHabitForm';
import { render } from '../mocks/TestUtils';

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe('New Habit Form Component', () => {
  window.ResizeObserver = ResizeObserver;

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should show error message when form is incomplete', async () => {
    const { findByText, getAllByRole, getByLabelText } = render(
      <NewHabitForm />
    );

    const submitButton = getAllByRole('button').find(
      (button) => button.getAttribute('type') == 'submit'
    );

    await userEvent.click(submitButton!);

    const formInputErrorMessage = await findByText(/campo obrigatório/i);
    const checkboxErrorMEssage = await findByText(/escolha ao menos/i);

    expect(formInputErrorMessage).toBeInTheDocument();
    expect(checkboxErrorMEssage).toBeInTheDocument();

    const formInput = getByLabelText(/qual/i);

    await userEvent.type(formInput, 'test');

    expect(formInput).toHaveValue('test');
    expect(formInputErrorMessage).not.toBeInTheDocument();
  });
});
