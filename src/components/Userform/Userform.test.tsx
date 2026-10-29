import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Userform from './Userform';
import { FormGroupType } from '../../types/auth';

const testSubmitFn = vi.fn();
const testRegisterFn = vi.fn();

const testResponseText = 'Response text';
const testFormValue = 'Input value';

const testformGroup: FormGroupType = {
  controlId: 'formBasicName',
  type: 'text',
  placeholder: '',
  onChange: () => {},
  onBlur: () => {},
  value: testFormValue,
};

const generateProps = () => {
  return {
    cardTitle: 'Sign In' as const,
    formGroup: testformGroup,
    onSubmitFunction: testSubmitFn,
    responseText: testResponseText,
    registerLink: false,
    buttonTitle: 'Sign In' as const,
    onRegisterClick: testRegisterFn,
  };
};

let userformProps = generateProps();

beforeEach(() => {
  testSubmitFn.mockClear();
  testRegisterFn.mockClear();
  userformProps = generateProps();
});

const userFormRenderer = () => {
  return render(
    <Userform
      cardTitle={userformProps.cardTitle}
      formGroup={[userformProps.formGroup]}
      responseText={userformProps.responseText}
      onRegisterClick={userformProps.onRegisterClick}
      onSubmitFunction={userformProps.onSubmitFunction}
      buttonTitle={userformProps.buttonTitle}
      registerLink={userformProps.registerLink}
    />,
  );
};

describe('Userform', () => {
  it('should render FormGroup elements with attributes corresponding to the array items received as props', () => {
    // arrange

    // act
    userFormRenderer();

    // assert
    expect(screen.getAllByText(userformProps.cardTitle)[0]).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue(testFormValue);
    expect(screen.getByText(testResponseText)).toBeInTheDocument();
  });

  it('should render a button with the name passed as buttonTitle from props', () => {
    // arrange

    // act
    userFormRenderer();

    // assert
    expect(screen.getByRole('button')).toHaveTextContent(
      userformProps.buttonTitle,
    );
  });

  it('should render a button that calls an "onSubmitFunction" callback passed as props', async () => {
    // arrange
    const user = userEvent.setup();

    // act
    userFormRenderer();
    await user.click(screen.getByRole('button'));

    // assert
    expect(testSubmitFn).toHaveBeenCalled();
  });

  it('should display a "register" button if registerLink prop is true', () => {
    // arrange
    userformProps.registerLink = true;

    // act
    userFormRenderer();

    // assert
    expect(screen.getByText(/Register/)).toBeInTheDocument();
  });

  it('should call an "onRegisterClick" callback if "register" button is clicked', async () => {
    // arrange
    userformProps.registerLink = true;

    const user = userEvent.setup();

    // act
    userFormRenderer();
    await user.click(screen.getByText(/Register/));

    // assert
    expect(testRegisterFn).toHaveBeenCalled();
  });
});
