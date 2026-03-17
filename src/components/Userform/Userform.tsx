import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormGroup from 'react-bootstrap/FormGroup';
import type { FormGroupType } from '../../types/auth';

function Userform({
  cardTitle,
  formGroup,
  onSubmitFunction,
  responseText,
  registerLink,
  buttonTitle,
  onRegisterClick,
}: {
  cardTitle: 'Sign Up' | 'Sign In';
  formGroup: FormGroupType[];
  onSubmitFunction: () => void;
  responseText: string;
  registerLink?: boolean;
  buttonTitle: 'Register' | 'Sign In';
  onRegisterClick?: () => void;
}) {
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
        <Button variant="primary" type="submit" onClick={onSubmitFunction}>
          {buttonTitle}
        </Button>
        {registerLink && (
          <Form.Text onClick={onRegisterClick} className="text-muted">
            Register
          </Form.Text>
        )}
      </Card.Body>
    </Card>
  );
}

export default Userform;
