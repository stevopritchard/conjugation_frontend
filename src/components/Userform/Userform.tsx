import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormGroup from 'react-bootstrap/FormGroup';
import { useNavigate } from 'react-router-dom';

type FormGroupType = {
  controlId: 'formBasicName' | 'formBasicEmail' | 'formBasicPassword';
  type: 'text' | 'email' | 'password';
  placeholder: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  value: string;
};

function Userform({
  cardTitle,
  formGroup,
  onSubmitFunction,
  responseText,
  routeChangeProps,
  buttonTitle,
}: {
  cardTitle: 'Sign Up' | 'Sign In';
  formGroup: FormGroupType[];
  onSubmitFunction: () => void;
  responseText: string;
  routeChangeProps: 'register';
  buttonTitle: 'Register' | 'Sign-in';
}) {
  let navigate = useNavigate();
  return (
    <Card style={{ margin: '0 auto' }}>
      <Card.Body>
        <Card.Title>{cardTitle}</Card.Title>
        {formGroup.map((group) => {
          return (
            <FormGroup key={group.controlId} controlId={group.controlId}>
              <Form.Control
                type={group.type}
                placeholder={group.placeholder}
                onChange={group.onChange}
                value={group.value}
              />
            </FormGroup>
          );
        })}
        <p
          style={{ pointerEvents: 'none', color: 'tomato', fontSize: '0.75em' }}
        >
          {responseText}
        </p>
        <Button
          variant="primary"
          type="submit"
          onClick={() => onSubmitFunction()}
        >
          {buttonTitle}
        </Button>
        {routeChangeProps && (
          <Form.Text
            onClick={() => navigate('/register')}
            className="text-muted"
          >
            Register
          </Form.Text>
        )}
      </Card.Body>
    </Card>
  );
}

export default Userform;
