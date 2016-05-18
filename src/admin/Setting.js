var React = require('react');

var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var Panel = require('react-bootstrap/lib/Panel');

var UserList = require('./UserList');
var FieldPanel = require('./FieldPanel');

// Testing
var Content = React.createClass({
	render: function() {
		return( 
			<div>
				<Grid>
					<Row>
						<Col>
							<h3>Admin Settings</h3>
							<p>	Modify or grant user restrictions</p>
							<hr />
							<FieldPanel />
							<hr />
							<UserList />
						</Col>
					</Row>
				</Grid>
			</div>
		);
	}
});

module.exports = Content;