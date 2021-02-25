var React = require('react');
 
class Loader extends React.Component{
              
    constructor(props){
        super(props);
    }
              
    render() {
        return (
					<div className="wrapper vh-100 bg-light">
						<div className="container h-100 d-flex justify-content-center align-items-center">
							<div className = "blob-1"></div>
							<div className = "blob-2"></div>
						</div>
					</div>
				);
    }
}
 
export default Loader;
