var React = require('react');
var $ = require('jquery');
var Signin = require('./Signin');
var Auth = require('./Auth');

var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');

var Image = require('react-bootstrap/lib/Image');
var Button = require('react-bootstrap/lib/Button');
var PageHeader = require('react-bootstrap/lib/PageHeader');
var Input = require('react-bootstrap/lib/Input');

var Overlay = require('react-bootstrap/lib/Overlay');
var OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');
var Modal = require('react-bootstrap/lib/Modal');
var ModalBody = require('react-bootstrap/lib/ModalBody');
var ModalDialog = require('react-bootstrap/lib/ModalDialog');
var ModalFooter = require('react-bootstrap/lib/ModalFooter');
var ModalHeader = require('react-bootstrap/lib/ModalHeader');
var ModalTitle = require('react-bootstrap/lib/ModalTitle');

var Header = React.createClass({
	/**
	 * Renders the title, logo, and installation information
	 * @return Header view
	 */
	render: function() {
		var login = (this.state.logged) ?
			<div>
				<h5>{this.state.username}</h5>
				<Button bsStyle="link" bsSize="xsmall" onClick={this.handleLogout}>
					Sign Out
				</Button>
			</div>
			:
			<div>
				<h5>Welcome</h5>
				<Button bsStyle="link" bsSize="xsmall" onClick={this.open}>
					Sign In
				</Button>
			</div>;
                
		return(
			<div>                            
				<Grid>
					<Row className="show-grid">
						<Col xs={10} md={10}>
							<PageHeader>Project Acai</PageHeader>
						</Col>
						<Col xs={2} md={2}>
							{login}
						</Col>
					</Row>
				</Grid>
				
				<Modal show={this.state.showModal} onHide={this.close}>
					<Modal.Header closeButton>
						<Modal.Title>Sign In</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Signin signinOnSuccess={this.signinOnSuccess} />
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.close}>Close</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);	
	},
	/**
	 * Initiates the component's states.
	 * @return {logged} true if user is logged 
	 *		{username} current logged username. Null if not logged.
	 */
	getInitialState: function() {
		return {
			logged : false,
			usernamme: "",
			showModal: false
		};
	},
	/**
	 * Whenever a page refreshes or a page is open, it'll
	 * relog the user if it hasn't logout.
	 */
	componentDidMount: function() {
		this.relog();
	},
	/**
	 * Logs the user out if logout button was click and 
	 * destroying the user's session.
	 * @param {e} button onClick event listener 
	 */
	handleLogout: function(e) {
		e.preventDefault();

		$.ajax({
			type: 'POST', 
			url: '/api/logout', 
			contentType: 'application/json',
			success: function() {
				this.setState({ logged: false });
				Auth.setLogout();
				this.props.getLoggedState(this.state.logged);
			}.bind(this),
			error: function(xhr, status, err) {
				console.log("(handleLogout)Callback error! ", err);
			}
		});
	},
	/**
	 * Relogs the user if the user hasn't log out and tries to refresh or 
	 * any similar actions of reopening a page. 
	 */
	relog: function() {
		$.ajax({
			type: 'POST',
			url: '/api/relog',
			contentType: 'application/json',
			success: function(session) {
				if(session != null) {
					Auth.setLoggedUser(session);
					this.setState({	
						logged: true,
						username: Auth.getUsername()
					}); 
					this.props.getLoggedState(this.state.logged);
				}
			}.bind(this),
			error: function(xhr, status, err) {
				console.log("(relog)Callback error! ", err);
			}
		});
	},
	signinOnSuccess: function() {
		this.setState({ 
			username: Auth.getUsername(),
			logged: true
		});
		this.close();
		this.props.getLoggedState(this.state.logged);
	},
	close: function() {
		this.setState({ showModal: false });
	},
	open: function() {
		this.setState({ showModal: true });
	}
});

module.exports = Header;