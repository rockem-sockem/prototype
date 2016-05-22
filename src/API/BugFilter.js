var React = require('react');
var Panel = require('react-bootstrap/lib/Panel');
var FormGroup = require('react-bootstrap/lib/FormGroup');
var FormControl = require('react-bootstrap/lib/FormControl');
var Button = require('react-bootstrap/lib/Button');

var BugFilter = React.createClass({
	render: function() {
		return (
			<Panel>
				<form>
					<h2>Filter</h2>
					<FormGroup controlId="filterTitle">
						<FormControl type="text" value={this.state.title} placeholder="Title" 
							onKeyPress={this.handleEnter} onChange={this.onChangeTitle} />
					</FormGroup>
					<FormGroup controlId="filterDeveloper">
						<FormControl type="text" value={this.state.developer} placeholder="Developer" 
							onKeyPress={this.handleEnter} onChange={this.onChangeDeveloper} />
					</FormGroup>
					<Button bsStyle="primary" onClick={this.onClickSubmit}>Apply</Button>
				</form>
			</Panel>
		)
	},
	getInitialState: function() {
		return {title: "", developer: ""};
	},

	
	
	onChangeTitle: function(e) {
		this.setState({title: e.target.value});
	},
	onChangeDeveloper: function(e) {
		this.setState({developer: e.target.value});
	},
	onClickSubmit: function(e) {
		e.preventDefault();
		this.submit();
	},
	handleEnter: function(e) {
		if (e.which == 13 || e.keyCode == 13) {
			this.submit();
		} 
    },
	submit: function() {
		this.props.submitHandler({title:this.state.title, developer:this.state.developer});
	}
});

module.exports = BugFilter;