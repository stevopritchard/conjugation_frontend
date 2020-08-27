import React from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import Scroll from '../../components/Scroll/Scroll';
import CardList from '../../components/CardList/CardList';
import {Conjugation} from '../../components/Conjugation'; 
import './Reference.css'

class Reference extends React.Component {
  constructor() {
    super()
    this.state = {
      searchfield: "",
      verbs: [],
      filteredVerbs: [],
      data: null,
      verbSelected: false,
      infinitive: "",
      gerund: "",
      past_participle: "",
      indicative_present: [],
      indicative_presentperfect: [],
      indicative_preterite: [],
      indicative_imperfect: [],
      indicative_pastperfect: [],
      indicative_conditional: [],
      indicative_conditionalperfect: [],
      indicative_future: [],
      indicative_futureperfect: [],
      imperative_affirmative: [],
      imperative_negative: [],
      subjunctive_present: [],
      subjunctive_presentperfect: [],
      subjunctive_pastperfect: [],
      subjunctive_imperfect: [],
      subjunctive_future: [],
      subjunctive_futureperfect: []
    };
    this.verbSelection = this.verbSelection.bind(this);
  }

  async componentDidMount() {
    this.setState({verbSelected: false})
    if(this.props.favourites !== null) {
      this.listFavourites()
    }
  }

  async listFavourites() {
    let favArray = [];
    try {
      await Promise.all(this.props.favourites.map(async function (favourite) {
        const response = await fetch('https://rocky-citadel-06291.herokuapp.com/favourite_verbs', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
          infinitive: favourite
          })
        })
        const verb = await response.json()
        favArray.push(verb)
      }))
      this.setState({filteredVerbs: favArray})
    } catch(err) {
      console.log(err)
    }
  }

  changeOnSearch = (event) => {
    this.setState({searchfield: event.target.value.toLowerCase()});
  }

  searchVerbs = () => {
    this.setState({verbSelected: false})
    if(this.state.searchfield !== "") {
      fetch('https://rocky-citadel-06291.herokuapp.com/infinitive', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          infinitive: this.state.searchfield
        })
      })
      .then(response => response.json())
      .then(data => this.setState({filteredVerbs: data}))
      .catch(err => console.log(err))
    }
  }

  verbSelection = (selection, verb) => {
    this.setState({
      verbSelected: selection, 
      infinitive: verb
      }
    );
    // if(this.props.favourites.some(this.checkFavourite) === true) { //NOTE: destructuring 'this.props.favourites' returned 'undefined'
    //   this.setState({isFavourite: true})
    // } else {
    //   this.setState({isFavourite: false})
    // }
    if(selection === true){
      const tenses = [
        'https://rocky-citadel-06291.herokuapp.com/gerund',
        'https://rocky-citadel-06291.herokuapp.com/past_participle',
        'https://rocky-citadel-06291.herokuapp.com/indicative_present',
        'https://rocky-citadel-06291.herokuapp.com/indicative_presentperfect',
        'https://rocky-citadel-06291.herokuapp.com/indicative_preterite',
        'https://rocky-citadel-06291.herokuapp.com/indicative_imperfect',
        'https://rocky-citadel-06291.herokuapp.com/indicative_pastperfect',
        'https://rocky-citadel-06291.herokuapp.com/indicative_conditional',
        'https://rocky-citadel-06291.herokuapp.com/indicative_conditionalperfect',
        'https://rocky-citadel-06291.herokuapp.com/indicative_future',
        'https://rocky-citadel-06291.herokuapp.com/indicative_futureperfect',
        'https://rocky-citadel-06291.herokuapp.com/imperative_affirmative',
        'https://rocky-citadel-06291.herokuapp.com/imperative_negative',
        'https://rocky-citadel-06291.herokuapp.com/subjunctive_present',
        'https://rocky-citadel-06291.herokuapp.com/subjunctive_presentperfect',
        'https://rocky-citadel-06291.herokuapp.com/subjunctive_pastperfect',
        'https://rocky-citadel-06291.herokuapp.com/subjunctive_imperfect',
        'https://rocky-citadel-06291.herokuapp.com/subjunctive_future',
        'https://rocky-citadel-06291.herokuapp.com/subjunctive_futureperfect',
      ]
        Promise.all(tenses.map(function(tense) {
          return fetch(tense, {
              method: 'post',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                infinitive: verb
              })
            })
            .then(response => Promise.resolve(response.json())) //Promise.resolve required to return map array
          }))
      .then(tenses => this.setState({
        gerund: tenses[0],
        past_participle: tenses[1],
        indicative_present: tenses[2],
        indicative_presentperfect: tenses[3],
        indicative_preterite: tenses[4],
        indicative_imperfect: tenses[5],
        indicative_pastperfect: tenses[6],
        indicative_conditional: tenses[7],
        indicative_conditionalperfect: tenses[8],
        indicative_future: tenses[9],
        indicative_futureperfect: tenses[10],
        imperative_affirmative: tenses[11],
        imperative_negative: tenses[12],
        subjunctive_present: tenses[13],
        subjunctive_presentperfect: tenses[14],
        subjunctive_pastperfect: tenses[15],
        subjunctive_imperfect: tenses[16],
        subjunctive_future: tenses[17],
        subjunctive_futureperfect: tenses[18]
      }))
      .catch(err => console.log(err))

    }
  }

  addFavourite = (verb, id) => {
    fetch('https://rocky-citadel-06291.herokuapp.com/add_favourite', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        infinitive: verb,
        id: id
      })
    })
    .then(response => response.json())
    .catch(err => console.log(err))
  }
  
  removeFavourite = (verb, id) => {
    fetch('https://rocky-citadel-06291.herokuapp.com/remove_favourite', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        infinitive: verb,
        id: id
      })
    })
    .then(response => response.json())
    .catch(err => console.log(err))
  }

  render() {
    const { 
      filteredVerbs, 
      verbSelected, 
      infinitive, 
      gerund, 
      past_participle,
      indicative_present,
      indicative_presentperfect,
      indicative_preterite,
      indicative_imperfect,
      indicative_pastperfect,
      indicative_conditional,
      indicative_conditionalperfect,
      indicative_future,
      indicative_futureperfect,
      imperative_affirmative,
      imperative_negative,
      subjunctive_present,
      subjunctive_presentperfect,
      subjunctive_pastperfect,
      subjunctive_imperfect,
      subjunctive_future,
      subjunctive_futureperfect
    } = this.state;
    const { id, favourites } = this.props;
    return (
      <div>
          <SearchBar 
            searchChange = {this.changeOnSearch}
            filterVerbs = {this.searchVerbs}
          />
          {
            verbSelected === true //if false, sets 'initial state' value
            ? 
            <Conjugation 
              infinitive={infinitive}
              gerund={gerund}
              past_participle={past_participle  }
              indicative_present={indicative_present}
              indicative_presentperfect={indicative_presentperfect}
              indicative_preterite={indicative_preterite}
              indicative_imperfect={indicative_imperfect}
              indicative_pastperfect={indicative_pastperfect}
              indicative_conditional={indicative_conditional}
              indicative_conditionalperfect={indicative_conditionalperfect}
              indicative_future={indicative_future}
              indicative_futureperfect={indicative_futureperfect}
              imperative_affirmative={imperative_affirmative}
              imperative_negative={imperative_negative}
              subjunctive_present={subjunctive_present}
              subjunctive_presentperfect={subjunctive_presentperfect}
              subjunctive_pastperfect={subjunctive_pastperfect}
              subjunctive_imperfect={subjunctive_imperfect}
              subjunctive_future={subjunctive_future}
              subjunctive_futureperfect={subjunctive_futureperfect}
              addFavourite={this.addFavourite}
              removeFavourite={this.removeFavourite}
              id={id}
              favourites={favourites}
              isFavourite={this.isFavourite}
            />
            :
            <Scroll>
                <CardList
                  verbs={filteredVerbs}
                  select={this.verbSelection}
                />
            </Scroll>
          }
      </div>
    )
  }
}

export default Reference;
  