var React = require('react');
var $ = require('jquery');

var Panel = require('react-bootstrap/lib/Panel');
var Input = require('react-bootstrap/lib/Input');
var Button = require('react-bootstrap/lib/Button');
var FormGroup = require('react-bootstrap/lib/FormGroup');
var FormControl = require('react-bootstrap/lib/FormControl');

var FieldPanel = React.createClass({
	render: function() {
		//<FieldUpdate />
	
		return(
			<div>
				<Panel>
					<FieldAdd reloadData={this.loadData} />
					<br />
					<FieldRemove options={this.state.fields} reloadData={this.loadData} />
					
				</Panel>
			</div>
		);
	}, 
	getInitialState: function() {
		return{
			fields: []
		};
	},
	componentDidMount: function() {
		this.loadData();
	},

	
	
	
	loadData: function() {
		$.ajax('/field', { data: {} }).done(function(data) {
			this.setState({fields: data});
		}.bind(this));
	}
});

var FieldAdd = React.createClass({
	render: function() {
		return(
			<div>
				<h3>Add Field</h3>
				<form>
					<FormGroup controlId="field">
						<FormControl type="text" value={this.state.fField} placeholder="Field name" 
							onKeyPress={this.handleEnter} onChange={this.handleChange} />
					</FormGroup>
					<Button bsStyle="primary" onClick={this.onClickAdd}>Add</Button>
				</form>
			</div>
		);
	},
	getInitialState: function() {
		return{
			fField: ""
		}
	},
	
	
	
	handleEnter: function(e) {
		if (e.which == 13 || e.keyCode == 13) {
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
		var options = this.props.options.map(function(opt) {
			return <RemoveOption key={opt._id} name={opt.name} />;
		});

		return(
			<div>
				<h3>Remove Field</h3>
				<form id="fieldRemove">
					<FormGroup controlId="options">
						<FormControl componentClass="select" >
							{options}
						</FormControl>
						<br />
						<Button bsStyle="primary" onClick={this.remove}>Remove</Button>
					</FormGroup>
				</form>
			</div>
		);
	},
	
	
	
	remove: function(e) {
		e.preventDefault();
		console.log(document.forms.fieldRemove.options.value);
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

var RemoveOption = React.createClass({
	render: function() {
		return(
			<option>{this.props.name}</option>
		);
	}
});

var FieldUpdate = React.createClass({
	render: function() {
		return(
			<div>
				<h2>Update Data</h2>
				<form name="updateDataForm">
					<Input type="text" name="field" placeholder="Field name"/> <br/>
					<Input type="text" name="title" placeholder="Game Title"/> <br/>
					<Input type="text" name="data" placeholder="Data to be inserted or modified"/> <br/>
					<Button bsStyle="primary" onClick={this.updateData}>Update data</Button>
				</form>
			</div>
		);
	},
	updateData: function(e) {
		e.preventDefault();
		var form = document.forms.updateDataForm;
		var field = form.field.value;
		var title = form.title.value;
		var newData = form.data.value;
		var sendData = { 
			"field" : field,
			"title" : title,
			"data" : newData
		};
		
		if(field == null || field == "" || title == null || title == "") {
			alert("Empty field or title");
			return;
		}
		
		$.ajax({
			type: 'POST', 
			url: '/field/data/update', 
			contentType: 'application/json',
			data: JSON.stringify(sendData),
			// @param {data} username, role
			success: function(data) {
				if(data != null) {
					form.field.value = "";
					form.title.value = "";
					form.data.value = "";
				} 
			}.bind(this),
			error: function(xhr, status, err) {
				console.log("(FieldPanel-FieldUpdate.updateData)Callback error! ", err);
			}
		});
	}
});

module.exports = FieldPanel;