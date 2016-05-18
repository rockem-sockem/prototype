var React = require('react');
var ReactDOM = require('react-dom');

var Panel = require('react-bootstrap/lib/Panel');
var Input = require('react-bootstrap/lib/Input');
var Button = require('react-bootstrap/lib/Button');

var BugFilter = React.createClass({
  render: function() {
    return (
		
		<div>
			<Panel>
				<Input type="text" value={this.state.title} placeholder="Title" onChange={this.onChangeTitle}/> <br/>
				<Input type="text" value={this.state.developer} placeholder="Developer" onChange={this.onChangeDeveloper}/> <br/>
				<Button bsStyle="primary" onClick={this.submit}>Apply</Button>
			</Panel>
			<br/>
		</div>
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
  submit: function(e){
    this.props.submitHandler({title:this.state.title, developer:this.state.developer});
  }
});

module.exports = BugFilter;