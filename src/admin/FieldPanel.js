var React = require('react');
var $ = require('jquery');

var Panel = require('react-bootstrap/lib/Panel');
var Input = require('react-bootstrap/lib/Input');
var Button = require('react-bootstrap/lib/Button');

var FieldPanel = React.createClass({
	render: function() {
		return(
			<div>
				<Panel>
					<FieldAdd />
					<br />
					<FieldUpdate />
				</Panel>
			</div>
		);
	}
});

var FieldAdd = React.createClass({
	render: function() {
		return(
			<div>
				<h2>Add/Remove Field</h2>
				<form name="addFieldForm">
					<Input type="text" name="field" placeholder="Field name"/> <br/>
					<Button bsStyle="primary" onClick={this.addField}>Add Field</Button>
					<Button bsStyle="primary" onClick={this.removeField}>Remove Field</Button>
				</form>
			</div>
		);
	},
	addField: function(e) {
		e.preventDefault();
		var form = document.forms.addFieldForm;
		var field = form.field.value;
		var sendData = { "field" : field };
		
		if(field == null || field == "") {
			alert("Empty field");
			return;
		}
		
		$.ajax({
			type: 'POST', 
			url: '/field/add', 
			contentType: 'application/json',
			data: JSON.stringify(sendData),
			success: function(data) {
				if(data != null) {
					form.field.value = "";
				} else {
					alert("Field already exists!");
				}
			}.bind(this),
			error: function(xhr, status, err) {
				console.log("(FieldPanel-FieldAdd.addField)Callback error! ", err);
			}
		});
	},
	removeField: function(e) {
		e.preventDefault();
		var form = document.forms.addFieldForm;
		var field = form.field.value;
		var sendData = { "field" : field };
		
		if(field == null || field == "") {
			alert("Empty field");
			return;
		}
		
		$.ajax({
			type: 'POST', 
			url: '/field/remove', 
			contentType: 'application/json',
			data: JSON.stringify(sendData),
			success: function(data) {
				if(data == true) {
					form.field.value = "";
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