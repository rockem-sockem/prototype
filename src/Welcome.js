var React = require('react');

var BugList = require('./API/BugList');

// Test page 
var Welcome = React.createClass({
	render: function() {
		return(
			<div>
				<h1>Welcome</h1>
				<br/>
				<BugList />
			</div>
		);
	}
});

module.exports = Welcome;