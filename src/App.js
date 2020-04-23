import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'
import SearchBar from './components/SearchBar/SearchBar'
import Scroll from './components/Scroll/Scroll'
import './App.css';
import CardList from './components/CardList/CardList';
import Conjugation from './components/Conjugation/Conjugation';

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      searchfield: "",
      verbs: [],
      filteredVerbs: [],
      data: null,
      verbSelected: false,
      infinitive: "",
      gerund: ""
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
      verbSelected: selection, //can make this state toggle
      infinitive: verb
      },
      console.log("Verb: "+verb+" and Selection: "+ selection+this.state.verbSelected)
    )
    if(selection === true){
      fetch('http://localhost:5000/gerund', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          infinitive: verb
        })
      })
      .then(response => response.json())
      .then(data => this.setState({gerund: data}))
      .catch(err => console.log(err))
    }
  }
  
  render() {
    const { route, filteredVerbs, verbSelected, infinitive, gerund } = this.state
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
