var React = require('react');
import "../../node_modules/react-bootstrap-toggle/dist/bootstrap2-toggle.css";
import Toggle from 'react-bootstrap-toggle';
 
class Switch extends React.Component{
              
	constructor(props){
		super(props);

		// this.state = {
		// 	toggleActive: this.props.active
		// };
	}

	// onToggle(e) {
  //   this.setState({ toggleActive: !this.state.toggleActive });
	// 	this.props.onChange(e);
  // }
              
	render() {
		// console.log('?????????', this.props.active);
		return (
			<Toggle
				onClick={(e) => this.props.onChange(e)}
        on={this.props.on}
        off={this.props.off}
        size=""
        onstyle="warning"
        offstyle="secondary"
        active={this.props.active}
      />
		);
	}
}
 
export default Switch;
