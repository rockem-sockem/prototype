var React = require('react');
var $ = require('jquery');

var Auth = require('../Auth.js');
var Table = require('react-bootstrap/lib/Table');
var Button = require('react-bootstrap/lib/Button');

var UserList = React.createClass({
	render: function() {
		return(
			<div>
				<h3>User Data</h3>
				<Button onClick={this.handleRefresh}>Refresh</Button>
				<br/>
				<br/>
				<UserTable users={this.state.users} />
			</div>
		);
	},
	getInitialState: function() {
		return {users: []};
	},
	componentDidMount: function() {
		this.loadData({});
	},
	
	
	
	loadData: function(filter) {
		$.ajax('/api/users', {data:filter}).done(function(data) {
			this.setState({users: data});
		}.bind(this));
	},
	handleRefresh: function(e) {
		e.preventDefault();
		this.loadData({});
	}
});


var UserTable = React.createClass({
	render: function() {
		var userRows = this.props.users.map(function(user) {
			if(user.username != Auth.getUsername()) {
				return <UserRow key={user._id} user={user} />;
			}
		});
		
		return(
			<Table striped bordered condensed hover>
				<thead>
					<tr>
						<th>Username</th>
						<th>Role</th>
						<th>Switch</th>
					</tr>
				</thead>
				
				<tbody>
					{userRows}
				</tbody>
			</Table>
		);
	}	
});

var UserRow = React.createClass({
	render: function() {
		return(
			<tr>
				<td>{this.props.user.username}</td> 	
				<td>{this.state.role}</td>
				<td><Button onClick={this.handleSwitch} bsStyle="info">Toggle</Button></td>
			</tr>
		);
	},
	getInitialState: function() {
		return{
			role: this.props.user.role
		};
	},
	
	
	handleSwitch: function(e) {
		e.preventDefault();
		var switchedRole = this.switchRole(this.state.role);
		var user = { 
			username: this.props.user.username,
			role: switchedRole
		};
		
		$.ajax({
			type: 'POST', 
			url: '/api/switchRole', 
			contentType: 'application/json',
			data: JSON.stringify(user),
			success: function() {
				this.setState({
					role: switchedRole
				});
			}.bind(this),
			error: function(xhr, status, err) {
				console.log("(handleLogin)Callback error! ", err);
			}
		});
	},
	switchRole: function(role) {
		var result;
		
		if(role == "admin") {
			result = "user";
		} else {
			result = "admin";
		}
		return result;
	}
});

module.exports = UserList;