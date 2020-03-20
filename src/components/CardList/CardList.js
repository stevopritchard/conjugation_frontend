import React from 'react';
import VerbCard from '../VerbCard/VerbCard';

const Cardlist = ({ filteredVerbs }) => {
    return (
        <div>
            {
                filteredVerbs.map((verb, i) => {
                    return (
                        <VerbCard key={i} 
                            verb={filteredVerbs[i]}
                        />
                    );
                })
            }
        </div>
    );
}

export default Cardlist;