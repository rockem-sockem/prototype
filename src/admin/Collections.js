var React = require('react');
var $ = require('jquery');

var FormGroup = require('react-bootstrap/lib/FormGroup');
var FormControl = require('react-bootstrap/lib/FormControl');
var ControlLabel = require('react-bootstrap/lib/ControlLabel');
var Panel = require('react-bootstrap/lib/Panel');
var Button = require('react-bootstrap/lib/Button');

var Collections = React.createClass({
	render: function() {
		var options = this.state.collections.map(function(coll) {
			if(coll.name != "system.indexes") {
				return <DataOptions key={coll.name} collections={coll} />;
			}
		});
		
		return(
			<Panel>
				<h3>Remove Data Collection</h3>
					<form id="collections">
						<FormGroup controlId="options">
							<ControlLabel>Multiple Selection (Hold down CTRL)</ControlLabel>
							<FormControl componentClass="select" multiple>
								{options}
							</FormControl>
						</FormGroup>
						<Button bsStyle="primary" onClick={this.removeSelected}>Remove</Button>
					</form>
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

	
	
	loadDropdown: function() {
		$.ajax('/api/datadbCollections', { data: {} }).done(function(data) {
			this.setState({collections: data});
		}.bind(this));
	},
	createQuery: function() {
		var selected = document.forms.collections.options;
		var result = { items: [] };
		
		for(var i=0; i < selected.length; i++) {
			var cur = selected[i];
			if(cur.selected) {
				result.items.push({ name: cur.value });
			}
		}
		return result;
	},
	removeSelected: function(e) {
		e.preventDefault();
		var sendData = this.createQuery();
		// var sendData = {items: selected};
		
		// May drop multiple collections depending on selected values
		$.ajax({
			type: 'DELETE', url: '/datadb/collection/drop', 
			contentType: 'application/json',
			data: JSON.stringify(sendData),
			success: function() {
				this.loadDropdown();
			}.bind(this),
			error: function(xhr, status, err) {
				console.log("Error collections:", err);
			}
		});
	}
});

var DataOptions = React.createClass({	
	render: function() {	
		return (
			<option>{this.props.collections.name}</option>
		);
	}
});

module.exports = Collections;