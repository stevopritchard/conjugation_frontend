import React from 'react'
import './Scroll.css'

class Scroll extends React.Component {
    constructor(props) {
        super(props);
    }

    handleScroll = (e) => {
        let elmnt = e.target;
    }
    render() {
        return (
            <div className="scroll" onScroll={this.handleScroll}>
                    {this.props.children}
             </div>
         )
    }
}

export default Scroll