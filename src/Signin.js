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
			wait: false // Used for avoiding spamming the signin button
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
			this.setState({ wait: false }); // Enable the use of signin button
			alert("Enter Username and Password");
			return;
		} 

		$.ajax({
			type: 'POST', 
			url: '/login', 
			contentType: 'application/json',
			data: JSON.stringify(user),
			// @param {data} username, role
			success: function(data) {
				if(data != null) {
					Auth.setLoggedUser(data);
					this.props.signinOnSuccess();
				} else {
					this.setState({ wait: false }); // Enable the use of signin button
					alert("Invalid username or wrong password");
				}
			}.bind(this),
			error: function(xhr, status, err) {
				console.log("(Signin.js/Signin.login)Callback error! ", err);
			}
		});
	},
	handleSignin: function(e) {
		e.preventDefault();
		if(this.checkWaitState()) {	return; }
		else { this.login(); }
	},
	handleEnter: function(e) {
		if (e.which == 13 || e.keyCode == 13) {
			if(this.checkWaitState()) {	return; }
			else { this.login(); }
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
		// To avoid spamming login being triggered multiple times
		if(this.state.wait) {
			return true;
		}
		this.setState({ wait: true }); // Disable the use of signin button
		return false;
	}
});



module.exports = Signin;