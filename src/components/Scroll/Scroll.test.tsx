import { render, screen } from '@testing-library/react';
import Scroll from './Scroll';

describe('Scroll', () => {
  it('should render a div with the class `.scroll`', () => {
    // Arrange

    // Act
    const { asFragment, container } = render(<Scroll>{''}</Scroll>);

    // Assert
    expect(asFragment()).toMatchSnapshot(`
      <div
        class="scroll"
      />
    `);

    expect(container.querySelector('.scroll'));
  });

  it('should render its children', () => {
    // Arrange
    const child = 'I am the child';

    // Act
    const { container } = render(<Scroll>{child}</Scroll>);
    const scrollElement = container.querySelector('.scroll');

    // Assert
    expect(scrollElement?.innerHTML).toEqual(child);
    // more idiomatic assertion
    expect(screen.getByText('I am the child')).toBeInTheDocument();
  });
});
