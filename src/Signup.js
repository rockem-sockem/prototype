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
			fPassword: "",
			wait: false // Used for avoiding spamming the signup button
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
			this.setState({ wait: false }); // Enable the use of signup button
			alert("Enter Username and Password");
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
					this.setState({ wait: false }); // Enable the use of signup button
					alert(username + " already exists");
				} else {
					this.props.closeModal();
				}
			}.bind(this),
			error: function(xhr, status, err) {
				console.log("(Signup.js/Signup.signup)Callback error! ", err);
			}
		});
	},
	handleSignup: function(e) {
		e.preventDefault();
		if(this.checkWaitState()) {	return; }
		else { this.signup(); }
	},
	handleEnter: function(e) {
		if (e.which == 13 || e.keyCode == 13) {
			if(this.checkWaitState()) {	return; }
			else { this.signup(); }
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
	},
	checkWaitState: function() {
		// To avoid spamming signup being triggered multiple times
		if(this.state.wait) {
			return true;
		}
		this.setState({ wait: true }); // Disable the use of signup button
		return false;
	}
});

module.exports = Signup;