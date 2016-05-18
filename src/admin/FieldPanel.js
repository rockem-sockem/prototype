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
					
				</Panel>
			</div>
		);
	}
});

var FieldAdd = React.createClass({
	render: function() {
		return(
			<div>
				<h2>Add Field</h2>
				<form name="addFieldForm">
					<Input type="text" name="field" placeholder="Field"/> <br/>
					<Button bsStyle="primary" onClick={this.addField}>Add Field</Button>
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
			// @param {data} username, role
			success: function(data) {
				if(data != null) {
					form.field.value = "";
				} else {
					alert("Field already exists!");
				}
			}.bind(this),
			error: function(xhr, status, err) {
				console.log("(FieldPanel.addField)Callback error! ", err);
			}
		});
	}
});

module.exports = FieldPanel;