var React = require('react');
var $ = require('jquery');

var Input = require('react-bootstrap/lib/Input');
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
				<form name="signUpForm">
					<Input type="text" name="username" placeholder="Username"/> <br/>
					<Input type="password" name="password" placeholder="Password"/> <br/>
					<Button bsStyle="primary" onClick={this.handleSignup}>Sign Up</Button>
				</form>
			</div>
		);
	},
	/**
	 * Submits the signup form by requesting an insert to the database.
	 * It doesn't allow duplicate usernames.
	 * @param {e} button onClick event listener
	 */
	handleSignup: function(e) {
		e.preventDefault();
		var form = document.forms.signUpForm;
		var username = form.username.value;
		var password = form.password.value;
		var user = {
			"username": username, 
			"password": password
		};	
		
		// Can't submit blank form fields
		if(username == null || username == "" ||
		password == null || password == "") {
			alert("Fill the Username and Password");
			return;
		}
		// Request the server to insert a new user
		$.ajax({
			type: 'POST', 
			url: '/api/signup', 
			contentType: 'application/json',
			data: JSON.stringify(user),
			success: function(data) {
				if(data != null) {
					// Cleaning the form fields
					form.username.value = form.password.value = "";
				} else {
					alert(form.username.value + " already exists");
				}
			}.bind(this),
			error: function(xhr, status, err) {
				console.log("(handleSignup)Callback error! ", err);
			}
		});
	}
});

module.exports = Signup;