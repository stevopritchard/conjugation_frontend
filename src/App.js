import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'
import SearchBar from './components/SearchBar/SearchBar'
import Scroll from './components/Scroll/Scroll'
import './App.css';
import CardList from './components/CardList/CardList';
import VerbCard from './components/VerbCard/VerbCard';

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      searchfield: "",
      verbs: [],
      filteredVerbs: [],
      data: null,
      // verbEsp: "",
      // verbEng: ""
    }
  }

  changeOnSearch = (event) => {
    this.setState({searchfield: event.target.value});
  }

  searchVerbs = () => {
    if(this.state.searchfield !== "") {
      fetch('http://localhost:5000/verbs', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          verb: this.state.searchfield
        })
      })
      .then(response => response.json())
      .then(data => this.setState({filteredVerbs: data}))
      // .then(data => {
      //   Object.keys(data).forEach((key =>{
      //     var idxEsp = data[key].infinitive;
      //     var idxEng = data[key].infinitive_english;
      //     var joinedEsp = this.state.verbEsp.concat(idxEsp);
      //     var joinedEng = this.state.verbEng.concat(idxEng);
      //     this.setState({
      //       verbEng: joinedEng,
      //       verbEsp: joinedEsp
      //     })
      //   }))
      //   console.log(this.state.verbEng+"\n"+this.state.verbEsp)
      // })
      .catch(err => console.log(err))
    }
  }
  
  render() {
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
          // filterVerbs = {this.filterVerbs}
          filterVerbs = {this.searchVerbs}
        />
        {
          this.state.verbEsp === "" 
          ? 
          null
          :
          <Scroll>
            <CardList
              verbs={this.state.filteredVerbs}
            />
          </Scroll>
        }
      </div>
    )
  }
}

export default App;
