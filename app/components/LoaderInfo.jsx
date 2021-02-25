var React = require('react');

import { Progress } from 'reactstrap'

class LoaderInfo extends React.Component {

	constructor(props) {
		super(props);
		// this.state = {
		// 	info: this.props.info,
		// 	loaded: this.props.loaded,
		// };
	}

	targets() {
		return this.props.info.targets ? this.props.info.targets : {}
	}

	targetSuccess(target) {
		return target.finished && target.status;
	}

	targetFinished(target) {
		return !!target.finished;
	}

	progressColor(target) {

		let className = 'primary'
		if (this.targetFinished(target)) {
			className = this.targetSuccess(target) ? 'success' : 'danger'
		}
		return className;
	}

	cardClass(target) {

		let className = ''
		if (this.targetFinished(target)) {
			className = this.targetSuccess(target) ? 'text-success' : 'text-danger'
		}
		return className;
	}


	cardHeader(key) {
		let target = this.props.info.targets[key]
		let cardClass = this.cardClass(target)
		let cardText = ""

		if (target.logs.length) {
			cardText = target.logs[target.logs.length - 1].message
		}
		return (
			<h2 className="mb-0">
				<button className="btn btn-block text-left" type="button" data-toggle="collapse"
					data-target={`#collapse-${key}`}>
					<div className={cardClass}>
						<b>{key}:</b> <small>{cardText}</small>
					</div>
				</button>
			</h2>
		);
	}


	cardBody(key) {
		let target = this.props.info.targets[key]
		return (
			target.logs.map((item, idx) => {
				let className = item.type == 'info' ? 'text-secondary' : 'text-danger'
				return (
					<div className={className}>
						{item.message}
					</div>
				)
			})
		);
	}


	render() {
		return (
			<div>
				<Progress max="100"
					color={this.progressColor(this.props.info)}
					value={this.props.loaded}
					striped="true"
					animated={!this.targetFinished(this.props.info)}
				>


					{Math.round(this.props.loaded, 2)}%
				</Progress>

				<div className="mt-3 w-100 d-flex justify-content-start overflow-auto">
					<div className="accordion w-100" id="LoaderInfo">
						{
							Object.keys(this.targets()).map((key, idx) => {
								return (
									<div className="card">
										<div className="card-header p-0" id={`heading-${key}`}>
											{this.cardHeader(key)}
										</div>

										<div id={`collapse-${key}`} className="collapse" data-parent={`#heading-${key}`} data-toggle="false">
											<div className="card-body">
												{this.cardBody(key)}
											</div>
										</div>
									</div>
								);
							})

						}
					</div>
				</div>

			</div>
		);
	}
}

export default LoaderInfo;
