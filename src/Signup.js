var React = require('react');
var $ = require('jquery');
var FormGroup = require('react-bootstrap/lib/FormGroup');
var FormControl = require('react-bootstrap/lib/FormControl');
var Button = require('react-bootstrap/lib/Button');

// Class used to sign up an user to the app.
var Signup = React.createClass({
	/**
	 * Renders the signup form with username and password fields.
	 * @return Html signup form to be rendered
	 */
	render: function() {
		return(
			<div>
				<h2>Welcome to Project ACAI!</h2> <br/>
				<form>
					<FormGroup controlId="username">
						<FormControl type="text" value={this.state.fUsername} placeholder="Username" 
							onKeyPress={this.handleEnter} onChange={this.handleChange} />
					</FormGroup>
					<FormGroup controlId="password">
						<FormControl type="password" value={this.state.fPassword} placeholder="Password" 
							onKeyPress={this.handleEnter} onChange={this.handleChange} />
					</FormGroup>
					<Button bsStyle="primary" onClick={this.handleSignup}>Sign Up</Button>
				</form>
			</div>
		);
	},
	getInitialState: function() {
		return{
			fUsername: "",
			fPassword: ""
		};
	},
	signup: function() {
		var username = this.state.fUsername;
		var password = this.state.fPassword;
		var user = {
			"username": username, 
			"password": password
		};	
		
		// Can't submit blank form fields
		if(username == null || username == "" ||
		password == null || password == "") {
			alert("Enter the Username and Password");
			return;
		}
		// Request the server to insert a new user
		$.ajax({
			type: 'POST', 
			url: '/signup', 
			contentType: 'application/json',
			data: JSON.stringify(user),
			success: function(data) {
				if(data == null) {
					alert(username + " already exists");
				} else {
					this.props.closeModal();
				}
			}.bind(this),
			error: function(xhr, status, err) {
				console.log("(handleSignup)Callback error! ", err);
			}
		});
	},
	handleSignup: function(e) {
		e.preventDefault();
		this.signup();
	},
	handleEnter: function(e) {
		if (e.which == 13 || e.keyCode == 13) {
			this.signup();
		}
    },
	handleChange: function(e) {
		var state;
		if(e.target.id == "username") {
			state = "fUsername";
		} else {
			state = "fPassword";
		}
		this.setState({ [state]: e.target.value });
	}
});

module.exports = Signup;