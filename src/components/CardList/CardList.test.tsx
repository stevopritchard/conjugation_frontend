import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cardlist from './CardList';

describe('CardList', () => {
  it('renders the correct number of VerbCard components when passed a list of verbs', () => {
    // arrange
    const verbList = [
      { infinitive: 'ser', infinitive_english: 'to be' },
      { infinitive: 'ir', infinitive_english: 'to go' },
      { infinitive: 'hablar', infinitive_english: 'to talk' },
    ];

    // act
    const { container } = render(
      <Cardlist verbs={verbList} select={() => {}} />,
    );

    // assert
    expect(container.querySelectorAll('.card')).toHaveLength(verbList.length);
  });

  it("renders each verb's spanish and english text", () => {
    // arrange
    const verbList = [{ infinitive: 'ser', infinitive_english: 'to be' }];

    // act
    render(<Cardlist verbs={verbList} select={() => {}} />);

    // assert
    expect(screen.getByText(verbList[0].infinitive)).toBeInTheDocument();
    expect(
      screen.getByText(verbList[0].infinitive_english),
    ).toBeInTheDocument();
  });

  it('calls select with the correct arguments when a button is clicked', async () => {
    // arrange
    const verbList = [{ infinitive: 'ser', infinitive_english: 'to be' }];
    const user = userEvent.setup();
    const select = vi.fn();

    // act
    render(<Cardlist verbs={verbList} select={select} />);
    await user.click(screen.getByRole('button', { name: /Select/ }));

    // assert
    expect(select).toHaveBeenCalledWith(true, 'ser');
  });
});
