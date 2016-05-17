var React = require('react');
var $ = require('jquery');

var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var Input = require('react-bootstrap/lib/Input');
var ButtonInput = require('react-bootstrap/lib/ButtonInput');

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
							<form name="searchForm">
								<Input type="text" name="filters" placeholder="Enter tags"/> <br/>
								<ButtonInput bsStyle="primary" value="Search" onClick={this.handleSearch} />
							</form>
						</Col>
						<Col xs={1} md={1}></Col>
					</Row>
				</Grid>
			</div>
		);
	},	
	/**
	 * Searches the database for the related tags. Search still not fleshed out.
	 */
	handleSearch: function(e) {
		e.preventDefault();
		var form = document.forms.searchForm;
		var filters = form.filters.value;
		var tags = filters.split(" ");
		
		// No empty form fields allowed
		if(filters == null || filters == "") {
			alert("");
			return;
		}
	}
});

module.exports = Search;