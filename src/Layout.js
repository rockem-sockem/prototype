var React = require('react');

var Navbar = require('./navbar/Navbar');
var Header = require('./Header');

// Main Layout class of the website
var Layout = React.createClass({
	render: function() {
		return( 
			<div>
				<Header getRole={this.getRole} />
                <Navbar role={this.state.role}/>
				{this.props.children}
			</div>
		);
	},
	getInitialState: function() {
		return{
			role: ""
		};
	},
	getRole: function(r) {
		this.setState({
			role: r
		});
	}
});

module.exports = Layout;