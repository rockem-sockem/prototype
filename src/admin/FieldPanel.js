var React = require('react');
var $ = require('jquery');

var Panel = require('react-bootstrap/lib/Panel');
var Button = require('react-bootstrap/lib/Button');
var FormGroup = require('react-bootstrap/lib/FormGroup');
var FormControl = require('react-bootstrap/lib/FormControl');
var ControlLabel = require('react-bootstrap/lib/ControlLabel');

var Auth = require('../Auth.js');

var FieldPanel = React.createClass({
	render: function() {
		return(
			<div>
				<Panel>
					<FieldAdd reloadData={this.loadFields} />
					<br />
					<FieldRemove fields={this.state.fields} reloadData={this.loadFields} />
					<br />
					<FieldUpdate fields={this.state.fields} games={this.state.games} />
				</Panel>
			</div>
		);
	}, 
	getInitialState: function() {
		return{
			fields: [],
			games: []
		};
	},
	componentDidMount: function() {
		this.loadFields();
		//Gets the game titles 
		$.ajax('/api/bugs', { data: { collName: Auth.getColl() } }).done(function(data) {
			this.setState({games: data});
		}.bind(this));
	},

	
	
	loadFields: function() {
		// Gets the extra fields
		$.ajax('/field', { data: {} }).done(function(data) {
			this.setState({fields: data});
		}.bind(this));
		
	}
});




var FieldAdd = React.createClass({
	render: function() {
		return(
			<form>
				<h3>Add Field</h3>
				<FormGroup controlId="field">
					<FormControl type="text" value={this.state.fField} placeholder="Field name" 
						onKeyPress={this.handleEnter} onChange={this.handleChange} />
				</FormGroup>
				<Button bsStyle="primary" onClick={this.onClickAdd}>Add</Button>
			</form>
		);
	},
	getInitialState: function() {
		return{
			fField: ""
		};
	},
	
	
	
	handleEnter: function(e) {
		if (e.which == 13 || e.keyCode == 13) {
			e.preventDefault();
			this.addField();
		} 
	},	
	handleChange: function(e) {
		this.setState({ fField: e.target.value });
	},
	onClickAdd: function(e) {
		e.preventDefault();
		this.addField();
	},
	addField: function() {
		var sendData = { "field" : this.state.fField };
		
		if(this.state.fField == "") {
			alert("Enter the field name");
			return;
		}
		
		$.ajax({
			type: 'POST', 
			url: '/field/add', 
			contentType: 'application/json',
			data: JSON.stringify(sendData),
			success: function(data) {
				if(data != null) {
					this.setState({ fField: "" });
					this.props.reloadData();
				} else {
					alert("Field already exists!");
				}
			}.bind(this),
			error: function(xhr, status, err) {
				console.log("(FieldPanel.js-FieldAdd.addField)Callback error! ", err);
			}
		});
	}
});



var FieldRemove = React.createClass({
	render: function() {
		var fieldOptions = this.props.fields.map(function(field) {
			return <FieldOption key={field._id} name={field.name} />;
		});

		return(
			<form id="fieldRemove">
				<h3>Remove Field</h3>
				<FormGroup controlId="options">
					<FormControl componentClass="select" >
						{fieldOptions}
					</FormControl>
				</FormGroup>
				<Button bsStyle="primary" onClick={this.remove}>Remove</Button>
			</form>
		);
	},
	
	
	
	remove: function(e) {
		e.preventDefault();
		var field = document.forms.fieldRemove.options.value;
		var sendData = { "field" : field };

		$.ajax({
			type: 'DELETE', 
			url: '/field/remove', 
			contentType: 'application/json',
			data: JSON.stringify(sendData),
			success: function(data) {
				if(data == true) {
					this.props.reloadData();
				} else {
					alert("Field doesn't exists!");
				}
			}.bind(this),
			error: function(xhr, status, err) {
				console.log("(FieldPanel-FieldAdd.removeField)Callback error! ", err);
			}
		});
	}
});



var FieldUpdate = React.createClass({
	render: function() {
		var fieldOptions = this.props.fields.map(function(field) {
			return <FieldOption key={field._id} name={field.name} />;
		});
		var titleOptions = this.props.games.map(function(game) {
			return <TitleOption key={game._id} title={game.title} />;
		});
	
		return(
			<form id="updateField">
				<h3>Update Data</h3>
				<FormGroup controlId="fieldsMenu">
					<ControlLabel>Select Field</ControlLabel>
					<FormControl componentClass="select" >
						{fieldOptions}
					</FormControl>
				</FormGroup>
				<FormGroup controlId="titleMenu">
					<ControlLabel>Select Game Title</ControlLabel>
					<FormControl componentClass="select" >
						{titleOptions}
					</FormControl>
				</FormGroup>
				<FormGroup controlId="updateText">
					<FormControl type="text" placeholder="Data to be inserted/modified"
						onKeyPress={this.handleEnter} />
				</FormGroup>
				<Button bsStyle="primary" onClick={this.onClickUpdate}>Update</Button>
			</form>
		);
	},
	
	
	
	handleEnter: function(e) {
		if (e.which == 13 || e.keyCode == 13) {
			e.preventDefault();
			this.update();
		} 
	},
	onClickUpdate: function(e) {
		e.preventDefault();
		this.update();
	},
	update: function() {
		var form = document.forms.updateField;
		var field = form.fieldsMenu.value;
		var title = form.titleMenu.value;
		var newData = form.updateText.value;
		var sendData = { 
			"field" : field,
			"title" : title,
			"data" : newData,
			"collName": Auth.getColl()
		};
		
		if(field == null || field == "" || title == null || title == "") {
			alert("Empty field or title");
			return;
		}
		
		$.ajax({
			type: 'PUT', 
			url: '/field/data/update', 
			contentType: 'application/json',
			data: JSON.stringify(sendData),
			success: function(data) {
				if(data != null) {
					form.updateText.value = "";
				} 
			}.bind(this),
			error: function(xhr, status, err) {
				console.log("(FieldPanel-FieldUpdate.updateData)Callback error! ", err);
			}
		});
	}
});

var FieldOption = React.createClass({
	render: function() {
		return(
			<option>{this.props.name}</option>
		);
	}
});

var TitleOption = React.createClass({
	render: function() {
		return(
			<option>{this.props.title}</option>
		);
	}
});

module.exports = FieldPanel;