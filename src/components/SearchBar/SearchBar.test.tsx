import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('should call its onChange handler when the value of its text input is changed', async () => {
    // arrange
    const onSearchVerbs = vi.fn();
    const user = userEvent.setup();

    // act
    render(<SearchBar searchChange={onSearchVerbs} filterVerbs={() => {}} />);
    await user.type(screen.getByRole('textbox'), 'Hello world!');

    // assert
    expect(onSearchVerbs).toHaveBeenCalled();
  });

  it('should call its onClick handler when its button is clicked', async () => {
    // arrange
    const onFilterVerbs = vi.fn();
    const user = userEvent.setup();

    // act
    render(<SearchBar searchChange={() => {}} filterVerbs={onFilterVerbs} />);
    await user.click(screen.getByRole('button', { name: /Search/ }));

    // assert
    expect(onFilterVerbs).toHaveBeenCalled();
  });
});
