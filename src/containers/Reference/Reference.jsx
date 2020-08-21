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
        const response = await fetch('http://localhost:5000/favourite_verbs', {
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
      fetch('http://localhost:5000/infinitive', {
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
        'http://localhost:5000/gerund',
        'http://localhost:5000/past_participle',
        'http://localhost:5000/indicative_present',
        'http://localhost:5000/indicative_presentperfect',
        'http://localhost:5000/indicative_preterite',
        'http://localhost:5000/indicative_imperfect',
        'http://localhost:5000/indicative_pastperfect',
        'http://localhost:5000/indicative_conditional',
        'http://localhost:5000/indicative_conditionalperfect',
        'http://localhost:5000/indicative_future',
        'http://localhost:5000/indicative_futureperfect',
        'http://localhost:5000/imperative_affirmative',
        'http://localhost:5000/imperative_negative',
        'http://localhost:5000/subjunctive_present',
        'http://localhost:5000/subjunctive_presentperfect',
        'http://localhost:5000/subjunctive_pastperfect',
        'http://localhost:5000/subjunctive_imperfect',
        'http://localhost:5000/subjunctive_future',
        'http://localhost:5000/subjunctive_futureperfect',
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
    fetch('http://localhost:5000/add_favourite', {
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
    fetch('http://localhost:5000/remove_favourite', {
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
  