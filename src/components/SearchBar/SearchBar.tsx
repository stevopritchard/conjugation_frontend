import React from 'react';
import { InputGroup, Button, FormControl } from 'react-bootstrap';
import './SearchBar.css';

interface SearchBarProps {
  filterVerbs: () => void;
  searchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar = ({ filterVerbs, searchChange }: SearchBarProps) => {
  return (
    <div className="container">
      <InputGroup>
        <FormControl
          type="text"
          placeholder="Enter verb here"
          onChange={searchChange}
        />
        <InputGroup.Append>
          <Button
            onClick={() => {
              filterVerbs();
            }}
          >
            Search
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </div>
  );
};

export default SearchBar;
