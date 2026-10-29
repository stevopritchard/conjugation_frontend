import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VerbCard from './VerbCard';

describe('VerbCard', () => {
  it('should render spanish text as its title', () => {
    // Arrange
    const spanish = 'Ser';

    // Act
    const { container } = render(
      <VerbCard spanish={spanish} english="" select={() => {}} />,
    );

    // Assert
    expect(screen.getByText(spanish)).toBeInTheDocument();
    expect(container.querySelector('.card-title')?.innerHTML).toEqual(spanish);

    // will not work; heading is not inside a header element
    // expect(screen.getByRole('heading', { name: spanish }));
  });

  it('should render english text', () => {
    // Arrange
    const english = 'To be';

    // Act
    const { container } = render(
      <VerbCard spanish="" english={english} select={() => {}} />,
    );

    // Assert
    expect(screen.getByText(english)).toBeInTheDocument();
    expect(container.querySelector('.card-text')?.innerHTML).toEqual(english);
  });

  it('calls the select function when button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const select = vi.fn();

    // Act
    render(<VerbCard spanish="" english="" select={select} />);
    select.mockImplementation(() => {});
    await user.click(screen.getByRole('button', { name: /Select/ }));

    // Assert
    expect(select).toHaveBeenCalled();
  });
});
