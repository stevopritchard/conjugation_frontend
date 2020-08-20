import React from 'react';
import VerbCard from '../VerbCard/VerbCard';
import './CardList.css'


const Cardlist = ({ verbs, select }) => {
    return (
        <div className="cardList">
            {
                verbs.map((verb, i) => {
                    return (
                        <VerbCard key={i} 
                            spanish={verbs[i].infinitive}
                            english={verbs[i].infinitive_english}
                            select={select.bind(null,true,verbs[i].infinitive)}
                        />
                    );
                })
            }
        </div>
    );
}

export default Cardlist;