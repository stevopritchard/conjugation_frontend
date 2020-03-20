import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'
import SearchBar from './components/SearchBar/SearchBar'
import Scroll from './components/Scroll/Scroll'
import CardList from './components/CardList/CardList'
import './App.css';

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      searchfield: "",
      verbs: [],
      filteredVerbs: [],
      data: null
    }
  }

  componentDidMount() {
    fetch('https://raw.githubusercontent.com/ian-hamlin/verb-data/master/json/spanish/index.json')
    .then(response => response.json())
    .then(data => {
      Object.keys(data).forEach((key) => {
        var idx = data[key].first
        var joined = this.state.verbs.concat(idx)
        this.setState({verbs: joined})
      })
      console.log(this.state.verbs)
    })
    // .then(data =>{
    //     this.setState({verbs: data}, function () {
    //       console.log(this.state.verbs)
    //     })
    // })
    .catch(err => console.log(err))
    // this.callBackendAPI()
    // .then(res => this.setState({ data: res.express }))
    // .catch(err => console.log(err));
  }

  // callBackendAPI = async () => {
  //   const response = await fetch('http://localhost:5000/');
  //   const body = await response.json();

  //   if (response.status !== 200) {
  //     throw Error(body.message)
  //   }
  //   return body;
  // };

  changeOnSearch = (event) => {
    this.setState({searchfield: event.target.value})
  }

  filterVerbs = () => {
    let filtered = this.state.verbs.filter(verb => {
      return ( 
        verb.toLowerCase().includes(this.state.searchfield.toLowerCase())
      )
    })
    this.setState({filteredVerbs: filtered}, () => {
      console.log(this.state.filteredVerbs)
    })
  }

  // const {robots,searchfield} = this.state
  //       const filteredRobots = robots.filter(robot => {
  //           return (
  //               robot.name.toLowerCase().includes(searchfield.toLowerCase())
  //           )
  //       });
  
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
          filterVerbs = {this.filterVerbs}
        />
        <Scroll>
          <CardList filteredVerbs = {this.state.filteredVerbs} />
        </Scroll>
      </div>
    )
  }
}

export default App;
