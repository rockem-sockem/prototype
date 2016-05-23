var React = require('react');
var $ = require('jquery');

var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');



var UserList = require('./UserList');
var FieldPanel = require('./FieldPanel');
var Collections = require('./Collections');

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
							<Collections />
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