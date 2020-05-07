import React from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import Scroll from '../../components/Scroll/Scroll';
import CardList from '../../components/CardList/CardList';
import Conjugation from '../../components/Conjugation/Conjugation'; 

const initialState = {
    searchfield: "",
    verbs: [],
    filteredVerbs: [],
    data: null,
    verbSelected: false,
    infinitive: "",
    gerund: "",
    past_participle: "",
    indicative_present: [],
    indicative_preterite: [],
    indicative_imperfect: [],
    indicative_conditional: [],
    indicative_future: []
  }

  class Reference extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        // initialState,
        searchfield: "",
        verbs: [],
        filteredVerbs: [],
        data: null,
        verbSelected: false,
        infinitive: "",
        gerund: "",
        past_participle: "",
        indicative_present: [],
        indicative_preterite: [],
        indicative_imperfect: [],
        indicative_conditional: [],
        indicative_future: [],
        isFavourite: false,
      };
      this.verbSelection = this.verbSelection.bind(this);
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
            verb: this.state.searchfield
          })
        })
        .then(response => response.json())
        .then(data => this.setState({filteredVerbs: data}))
        .catch(err => console.log(err))
      }
    }

    checkFavourite = (verb) => {
      return verb === this.state.infinitive
    };

    verbSelection = (selection, verb) => {
      this.setState({
        verbSelected: selection, 
        infinitive: verb
        }
      );
      if(this.props.favourites.some(this.checkFavourite) === true) { //NOTE: destructuring 'this.props.favourites' returned 'undefined'
        this.setState({isFavourite: true})
      } else {
        this.setState({isFavourite: false})
      }
      if(selection === true){
        const tenses = [
          'http://localhost:5000/gerund',
          'http://localhost:5000/past_participle',
          'http://localhost:5000/indicative_present',
          'http://localhost:5000/indicative_preterite',
          'http://localhost:5000/indicative_imperfect',
          'http://localhost:5000/indicative_conditional',
          'http://localhost:5000/indicative_future'
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
          indicative_preterite: tenses[3],
          indicative_imperfect: tenses[4],
          indicative_conditional: tenses[5],
          indicative_future: tenses[6]
        }))
        .catch(err => console.log(err))

      }
    }

    addFavourite = (verb) => {
      fetch('http://localhost:5000/add_favourite', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          infinitive: verb,
          id: this.props.id
        })
      })
      .then(response => response.json())
      .then(response => console.log(response))
    }
    
    render() {
      const { 
        filteredVerbs, 
        verbSelected, 
        infinitive, 
        gerund, 
        past_participle,
        indicative_present,
        indicative_preterite,
        indicative_imperfect,
        indicative_conditional,
        indicative_future
      } = this.state;
      const { id, favourites } = this.props;
      // console.log(this.props.favourites);
      // console.log(this.state.infinitive);
      console.log(this.props.favourites.some(this.checkFavourite));
      console.log(this.state.isFavourite)
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
                indicative_preterite={indicative_preterite}
                indicative_imperfect={indicative_imperfect}
                indicative_conditional={indicative_conditional}
                indicative_future={indicative_future}
                addFavourite={this.addFavourite}
                id={id}
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
  