var React = require('react');
var $ = require('jquery');

var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var Tab = require('react-bootstrap/lib/Tab');
var Tabs = require('react-bootstrap/lib/Tabs');
var TabContainer = require('react-bootstrap/lib/TabContainer');
var TabContent = require('react-bootstrap/lib/TabContainer');

var Glyphicon = require('react-bootstrap/lib/Glyphicon');

var Home = require('../Home');
var Settings = require('../admin/Setting');
var Search = require('../Search');

// Represent the Navbar layout
var Navbar = React.createClass({
	/**
	 * Renders the tabs for the Navbar
	 * @return Navbar view
	 */
	render: function() {
		var homeTab = (this.state.showHome) ? 
			<Tab eventKey={1} title="Home"><Home /></Tab>
			: "";
		var searchTab = (this.state.showSearch) ?
			<Tab eventKey={2} title="Search"><Search /></Tab>
			: "";
		var settingsTab = (this.state.showSettings) ?
			<Tab eventKey={3} title="Settings"><Settings /></Tab>
			: "";
			
		return(
			<Grid>
				<Row>
					<Col xs={12} md={12}>
						<Tabs defaultActiveKey={1} id="navbar-alt">
							{homeTab}
							{searchTab}
							{settingsTab}							
						</Tabs>
					</Col>
				</Row>
			</Grid>
		);	
	},
	/**
	 * Initiates the class' state.
	 * @return {role} 
	 */
	getInitialState: function() {
		return {
			role: "",
			showHome: true,
			showSearch: false,
			showSettings: false 
		};
	},
	componentWillReceiveProps: function() {
		this.setTab();
	},
	/**
	 * Gets the role after a user logs in or relogs from 
	 * the child(Login) class.
	 * @param {res} the result/response after the function was 
	 * 		used in the Login class
	 */
	getRole: function() {
		$.ajax({
			type: 'POST',
			url: '/api/relog',
			contentType: 'application/json',
			success: function(session) {
				if(session != null) {
					this.setState({
						role: session.role
					});
					this.setTab();
					console.log("role ", this.state.role);
				}
			}.bind(this),
			error: function(xhr, status, err) {
				console.log("(relog)Callback error! ", err);
			}
		});
	},
	setTab: function() {
		switch(this.props.role) {
			case "admin":
				this.setState({
					showHome: true,
					showSearch: true,
					showSettings: true
				});
				break;
			case "user":
				this.setState({
					showHome: true,
					showSearch: true,
					showSettings: false
				});
				break;
			default:
				this.setState({
					showHome: true,
					showSearch: false,
					showSettings: false
				});
		}
	}
});

module.exports = Navbar;