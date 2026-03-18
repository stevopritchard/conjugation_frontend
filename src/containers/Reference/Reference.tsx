import { useEffect, useContext } from 'react';
import { ConjugationContext } from '../../store/conjugation-context';
import SearchBar from '../../components/SearchBar/SearchBar';
import Scroll from '../../components/Scroll/Scroll';
import CardList from '../../components/CardList/CardList';
import { Conjugation } from '../../components/Conjugation';
import './Reference.css';

function Reference({ id }: { id: number }) {
  const {
    setSearchfield,
    filteredVerbs,
    verbSelected,
    listFavourites,
    searchVerbs,
    verbSelection,
  } = useContext(ConjugationContext);

  useEffect(() => {
    listFavourites(id);
  }, [listFavourites, id]);

  function changeOnSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchfield(event.target.value.toLowerCase());
  }

  return (
    <div>
      <SearchBar
        searchChange={changeOnSearch}
        filterVerbs={() => searchVerbs(id)}
      />
      {verbSelected ? (
        <Conjugation id={id} />
      ) : (
        <Scroll>
          <CardList verbs={filteredVerbs} select={verbSelection} />
        </Scroll>
      )}
    </div>
  );
}

export default Reference;
