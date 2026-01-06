import VerbCard from '../VerbCard/VerbCard';
import './CardList.css';

interface Verb {
  infinitive: string;
  infinitive_english: string;
}

interface CardListProps {
  verbs: Verb[];
  select: (selection: boolean, verb: string) => void;
}

const Cardlist = ({ verbs, select }: CardListProps) => {
  return (
    <div className="cardList">
      {verbs.map((verb) => {
        return (
          <VerbCard
            key={verb.infinitive}
            spanish={verb.infinitive}
            english={verb.infinitive_english}
            select={() => select(true, verb.infinitive)}
          />
        );
      })}
    </div>
  );
};

export default Cardlist;
