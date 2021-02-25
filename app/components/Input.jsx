var React = require('react');
 
class Input extends React.Component{
              
	constructor(props){
		super(props);
	}
              
	render() {
		return (
				<div className={this.props.classContainer}>
					{ this.props.type == 'checkbox' &&
						<input
							type={this.props.type}
							id={this.props.id}
							className={this.props.className}
							placeholder={this.props.placeholder}
							defaultValue={this.props.value}
							defaultChecked={this.props.defaultChecked}
							onChange={(e) => this.props.onChange(e)}
							/>
					}

					{ this.props.title && <label className={this.props.classLabel} htmlFor={this.props.id}>{this.props.title}</label> }

					{ this.props.type != 'checkbox' &&
						<input
							type={this.props.type}
							id={this.props.id}
							className={this.props.className}
							placeholder={this.props.placeholder}
							defaultValue={this.props.value}
							onChange={(e) => this.props.onChange(e)}
							disabled={this.props.disabled && this.props.disabled}
							/>
					}
				</div>
		);
	}
}
 
export default Input;
