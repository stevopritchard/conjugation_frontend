import React from 'react';
import VerbCard from '../VerbCard/VerbCard';

const Cardlist = ({ verbs }) => {
    return (
        <div>
            {
                verbs.map((verb, i) => {
                    return (
                        <VerbCard key={i} 
                            spanish={verbs[i].infinitive}
                            english={verbs[i].infinitive_english}
                        />
                    );
                })
            }
        </div>
    );
}

export default Cardlist;