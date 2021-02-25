var React = require('react');
 
class LoaderMini extends React.Component{
              
    constructor(props){
        super(props);
    }
              
    render() {
        return (
						<div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center bg-opacity">
							<img src="../images/load_mini2.gif" height="60" />
						</div>
				);
    }
}
 
export default LoaderMini;
