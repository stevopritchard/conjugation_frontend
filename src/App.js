import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'
import SearchBar from './components/SearchBar/SearchBar'
import Scroll from './components/Scroll/Scroll'
import './App.css';
import CardList from './components/CardList/CardList';
import Conjugation from './components/Conjugation/Conjugation';

class App extends React.Component {
  constructor(props) {
    super(props)
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
      indicative_preterite: [],
      indicative_imperfect: [],
      indicative_conditional: [],
      indicative_future: []
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

  verbSelection = (selection, verb) => {
    this.setState({
      verbSelected: selection, 
      infinitive: verb
      }
    );
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
  
  render() {
    const { route, 
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
    return (
      <div className="App">
        <Navbar expand="lg">
          <Navbar.Brand>
            <div className="title">
              <h1>¡Conjugado!</h1>
            </div>
          </Navbar.Brand>
          <Nav className="ml-auto">
            <Nav.Link href="#register">Register</Nav.Link>
            {/* <Navigation/> */}
          </Nav>
        </Navbar>
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
            past_participle={past_participle}
            indicative_present={indicative_present}
            indicative_preterite={indicative_preterite}
            indicative_imperfect={indicative_imperfect}
            indicative_conditional={indicative_conditional}
            indicative_future={indicative_future}
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

export default App;
