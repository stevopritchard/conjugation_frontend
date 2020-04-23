import React from 'react';
import VerbCard from '../VerbCard/VerbCard';


const Cardlist = ({ verbs, select }) => {
    return (
        <div>
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

// class Cardlist extends React.Component {
//    render() {
//        const { verbs, select } = this.props;
//        return (
//             <div>
//                 {
//                     verbs.map((verb, i) => {
//                         return (
//                             <VerbCard key={i} 
//                                 spanish={verbs[i].infinitive}
//                                 english={verbs[i].infinitive_english}
//                                 select={select.bind(null,true,verbs[i].infinitive)}
//                             />
//                         );
//                     })
//                 }
//             </div>
//        )
//    }
// }

export default Cardlist;