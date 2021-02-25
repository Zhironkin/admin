var React = require('react');
 
class Loader extends React.Component{
              
    constructor(props){
        super(props);
    }
              
    render() {
        return (
					<p className="text-danger font-italic"><small>{this.props.text}</small></p>
				);
    }
}
 
export default Loader;
