var React = require('react');
var $ = require('jquery');
var Input = require('react-bootstrap/lib/Input');
var Button = require('react-bootstrap/lib/Button');
var Auth = require('./Auth.js');

// Class used to sign up an user to the app.
var Signin = React.createClass({
	/**
	 * Renders the signup form with username and password fields.
	 * @return Html signup form to be rendered
	 */
	render: function() {
		return(
			<div>
				<h2>Welcome Back!</h2> <br/>
				<form name="signinForm">
					<Input type="text" name="username" placeholder="Username"/> <br/>
					<Input type="password" name="password" placeholder="Password"/> <br/>
					<Button bsStyle="primary" onClick={this.handleLogin}>Sign In</Button>
				</form>
			</div>
		);
	},
	/**
	 * Logins the user if the username exists in the database
	 * and the correct password was input. After being log, It'll create a 
	 * session for the user and redirect to the welcome page.
	 * @param {e} button onClick event listener
	 */
	handleLogin: function(e) {
		console.log("Start handleLogin");
		e.preventDefault();
		var form = document.forms.signinForm;
		var username = form.username.value;
		var password = form.password.value;
		var user = { 
			"username" : username,
			"password" : password
		};
		
		// No empty form fields allowed
		if(username == null || username == "" ||
		password == null || password == "") {
			alert("Username or Password is empty");
			return;
		}

		$.ajax({
			type: 'POST', 
			url: '/api/login', 
			contentType: 'application/json',
			data: JSON.stringify(user),
			// @param {data} username, role
			success: function(data) {
				if(data != null) {
					Auth.setLoggedUser(data);
					this.props.signinOnSuccess();
				} else {
					alert("Invalid username or wrong password");
				}
			}.bind(this),
			error: function(xhr, status, err) {
				console.log("(handleLogin)Callback error! ", err);
			}
		});
	}
});

module.exports = Signin;