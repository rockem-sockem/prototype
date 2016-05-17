var React = require('react');
var ReactDOM = require('react-dom');

var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var Input = require('react-bootstrap/lib/Input');
var ButtonInput = require('react-bootstrap/lib/ButtonInput');

var BugAdd = React.createClass({
  render: function() {
    console.log("Rendering BugAdd");
    return (
      <div>
		  <Grid>
				<Row>
					<Col xs={1} md={1}></Col>
					<Col xs={10} md={10}>
						<form name="bugAdd">
							<Input type="text" name="owner" placeholder="Owner"/> <br/>
							<Input type="text" name="title" placeholder="Title"/> <br/>
							<ButtonInput bsStyle="primary" value="Add Bug" onClick={this.handleSubmit} />
						</form>
					</Col>
					<Col xs={1} md={1}></Col>
				</Row>
			</Grid>

      </div>
    )
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var form = document.forms.bugAdd;
    this.props.addBug({owner: form.owner.value, title: form.title.value, status: 'New', priority: 'P1'});
    // clear the form for the next input
    form.owner.value = ""; form.title.value = "";
  }
});

module.exports = BugAdd;
