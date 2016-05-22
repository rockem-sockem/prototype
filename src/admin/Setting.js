var React = require('react');
var $ = require('jquery');

var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var Panel = require('react-bootstrap/lib/Panel');
var Button = require('react-bootstrap/lib/Button');

var UserList = require('./UserList');
var FieldPanel = require('./FieldPanel');

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

var Collections = React.createClass({
	render: function() {
		var options = this.state.collections.map(function(coll) {
			if(coll.name != "system.indexes") {
				return <DataOptions key={coll.name} collections={coll} />;
			}
		});
		
		return(
			<Panel>
				<h2>Remove Data Collection</h2>
				<select id="removeColl" onChange={this.printSelected}>
					{options}
				</select>
				<br />
				<br />
				<Button bsStyle="primary" onClick={this.removeSelected} >Remove</Button>
			</Panel>
		);
	},
	getInitialState: function() {
		return{
			collections: []
		};
	},
	componentDidMount: function() {
		this.loadDropdown();
	},
	componentWillReceiveProps: function() {
		this.loadDropdown();
	},
	
	loadDropdown: function() {
		$.ajax('/api/datadbCollections', {data:{}}).done(function(data) {
			this.setState({collections: data});
		}.bind(this));
	},
	printSelected: function() {
		var selected = document.getElementById("removeColl").value;
		console.log("this is selected: ", selected);
	},
	removeSelected: function() {
		var selected = document.getElementById("removeColl").value;
		var query = {name: selected};
		
		$.ajax({
			type: 'POST', url: '/appdb/fields/removeOne', 
			contentType: 'application/json',
			data: JSON.stringify(query),
			success: function(data) {
				this.setState({
					collections: data 
				});
			}.bind(this),
			error: function(xhr, status, err) {
				console.log("Error changing collections:", err);
			}
		});
	}
});

var DataOptions = React.createClass({	
  render: function() {	
		return (
			<option>
				{this.props.collections.name}
			</option>
		)
  }
});

module.exports = Content;