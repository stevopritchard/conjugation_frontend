import React from 'react'
import './Scroll.css'

class Scroll extends React.Component {
    constructor(props) {
        super(props);
        // this.filteredVerbs = this.props
        this.scrollCards = React.createRef()
    }

    handleScroll = (e) => {
        let elmnt = e.target;
        // console.log(elmnt.scrollTop)
    }
    render() {
        return (
            <div className="scroll" ref={this.scrollCards} onScroll={this.handleScroll}>
                {this.props.children}
             </div>
         )
    }
}

export default Scroll