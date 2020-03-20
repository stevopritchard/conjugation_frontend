import React from 'react';
import { InputGroup, Button, FormControl } from 'react-bootstrap';
import './SearchBar.css'

const SearchBar = ({filterVerbs, searchChange}) => {
    return (
        <div className="container">
            <InputGroup>
                <FormControl
                    type="text"
                    placeholder="Enter verb here"
                    onChange = {searchChange}
                />
                <InputGroup.Append>
                    <Button onClick={() => {filterVerbs()}}>Search</Button>
                </InputGroup.Append>
            </InputGroup>
        </div>
    )
}

export default SearchBar