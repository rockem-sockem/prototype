var React = require('react');
var $ = require('jquery');
var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');

var BugList = require('./API/BugList');

// Class used to sign up an user to the app.
var Search = React.createClass({
	/**
	 * Renders the search form with a single input.
	 * @return Html search form to be rendered
	 */
	render: function() {
		return(
			<div>
				<Grid>
					<Row>
						<Col xs={1} md={1}></Col>
						<Col xs={10} md={10}>
							<h1>Search</h1> <br/>
								<BugList />
						</Col>
						<Col xs={1} md={1}></Col>
					</Row>
				</Grid>
			</div>
		);
	}
});

module.exports = Search;