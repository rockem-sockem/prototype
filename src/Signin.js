var React = require('react');
var $ = require('jquery');
var FormGroup = require('react-bootstrap/lib/FormGroup');
var FormControl = require('react-bootstrap/lib/FormControl');
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
				<form>
					<FormGroup controlId="username">
						<FormControl type="text" value={this.state.fUsername} placeholder="Username" 
							onKeyPress={this.handleEnter} onChange={this.handleChange} />
					</FormGroup>
					<FormGroup controlId="password">
						<FormControl type="password" value={this.state.fPassword} placeholder="Password" 
							onKeyPress={this.handleEnter} onChange={this.handleChange} />
					</FormGroup>
					<Button bsStyle="primary" onClick={this.handleSignin}>Sign In</Button>
				</form>
			</div>
		);
	},
	getInitialState: function() {
		return{
			fUsername: "",
			fPassword: "", 
			wait: false
		};
	},
	
	
	
	login: function() {
		var username = this.state.fUsername;
		var password = this.state.fPassword;
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
		
		// To avoid spamming login being triggered multiple times
		if(this.state.wait) {
			return;
		}
		this.setState({ wait: true }); // disable login

		$.ajax({
			type: 'POST', 
			url: '/login', 
			contentType: 'application/json',
			data: JSON.stringify(user),
			// @param {data} username, role
			success: function(data) {
				if(data != null) {
					Auth.setLoggedUser(data);
					this.setState({ wait: false }); // disable login
					this.props.signinOnSuccess();
				} else {
					alert("Invalid username or wrong password");
					this.setState({ wait: false }); // disable login
				}
			}.bind(this),
			error: function(xhr, status, err) {
				console.log("(handleLogin)Callback error! ", err);
			}
		});
	},
	handleSignin: function(e) {
		e.preventDefault();
		this.login();
	},
	handleEnter: function(e) {
		if (e.which == 13 || e.keyCode == 13) {
			this.login();
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



module.exports = Signin;