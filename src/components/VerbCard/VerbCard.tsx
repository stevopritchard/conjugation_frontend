import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

interface VerbCardProps {
  spanish: string;
  english: string;
  select: () => void;
}

const VerbCard = ({ spanish, english, select }: VerbCardProps) => {
  return (
    <Card bg="light" style={{ width: '325px', margin: '20px' }}>
      <Card.Body>
        <Card.Title>{spanish}</Card.Title>
        <Card.Text>{english}</Card.Text>
        <Button variant="secondary" onClick={select}>
          Select
        </Button>
      </Card.Body>
    </Card>
  );
};

export default VerbCard;
