import userEvent from '@testing-library/user-event';
import { NewHabitForm } from '../components/Header/NewHabitForm';
import { render, screen } from './TestUtils';

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe('New Habit Form Component', () => {
  window.ResizeObserver = ResizeObserver;
  it('should show error message when form is incomplete', async () => {
    const { getByText, getAllByRole, getByLabelText } = render(
      <NewHabitForm />
    );

    const submitButton = getAllByRole('button').find(
      (button) => button.getAttribute('type') == 'submit'
    );

    await userEvent.click(submitButton!);

    const formInputErrorMessage = getByText(/campo obrigatório/i);
    const checkboxErrorMEssage = getByText(/escolha ao menos/i);

    expect(formInputErrorMessage).toBeInTheDocument();
    expect(checkboxErrorMEssage).toBeInTheDocument();

    const formInput = getByLabelText(/qual/i);

    await userEvent.type(formInput, 'test');

    expect(formInput).toHaveValue('test');
    expect(formInputErrorMessage).not.toBeInTheDocument();
  });

  it('should show loading on submit button when click on it', async () => {
    const { getAllByRole, getByLabelText, findByTestId } = render(
      <NewHabitForm />
    );

    const submitButton = getAllByRole('button').find(
      (button) => button.getAttribute('type') == 'submit'
    );

    const firstCheckBox = getAllByRole('checkbox')[0];
    const formInput = getByLabelText(/qual/i);

    await userEvent.click(firstCheckBox);
    await userEvent.type(formInput, 'test');
    await userEvent.click(submitButton!);

    expect(firstCheckBox.getAttribute('aria-checked')).toBe('true');
    expect(formInput).toHaveValue('test');
    expect(await findByTestId('submit-loading')).toBeInTheDocument();
  });
});
