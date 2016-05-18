var React = require('react');

var Navbar = require('./navbar/Navbar');
var Header = require('./Header');

// Main Layout class of the website
var Layout = React.createClass({
	render: function() {
		return( 
			<div>
				<Header getLoggedState={this.getLoggedState} />
                <Navbar logged={this.state.logged} />
				{this.props.children}
			</div>
		);
	},
	getInitialState: function() {
		return{ logged: false };
	},
	getLoggedState: function(result) {
		this.setState({ logged: result });
	}
});

module.exports = Layout;