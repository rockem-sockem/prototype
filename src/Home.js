var React = require('react');
var Signup = require('./Signup');

var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var Button = require('react-bootstrap/lib/Button');
var Jumbotron  = require('react-bootstrap/lib/Jumbotron');
var Panel  = require('react-bootstrap/lib/Panel');

var Overlay = require('react-bootstrap/lib/Overlay');
var OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');
var Modal = require('react-bootstrap/lib/Modal');
var ModalBody = require('react-bootstrap/lib/ModalBody');
var ModalDialog = require('react-bootstrap/lib/ModalDialog');
var ModalFooter = require('react-bootstrap/lib/ModalFooter');
var ModalHeader = require('react-bootstrap/lib/ModalHeader');
var ModalTitle = require('react-bootstrap/lib/ModalTitle');

// Home page class
var Home = React.createClass({
	getInitialState() {
		return { showModal: false };
	},

	close: function() {
		this.setState({ showModal: false });
	},

	open: function() {
		this.setState({ showModal: true });
	},
	
	render: function() {		
		return( 
			<div>
				<Grid>
					<br />
					<Row>
						<Col xs={1} md={1}></Col>
						<Col xs={10} md={10}>
							<Jumbotron>
								<h1>Welcome to Project ACAI!</h1>
								<p>Project ACAI is a web app that scrapes through various app stores (Google Play Store and iTunes App Store) and grabs the relevant data. The user can search through our database and filter their results based on their criteria to get the desired results.</p>
								<p><Button bsStyle="primary" bsSize="large" onClick={this.open}>Sign Up Here!</Button></p>
							</Jumbotron>
						</Col>
						<Col xs={1} md={1}></Col>
					</Row>
					<Row>
						<Col xs={1} md={1}></Col>
						<Col xs={10} md={10}>
							<Panel>
								<h1>Technologies</h1>
								<p>This web app is created with the MERN framework. MERN is a scaffolding tool which makes it easy to build isomorphic apps using Mongo, Express, React and NodeJS. It minimizes the setup time and gets you up to speed using proven technologies. All data is scraped together with </p>
							</Panel>
						</Col>
						<Col xs={1} md={1}></Col>
					</Row>
				</Grid>
				
				<Modal show={this.state.showModal} onHide={this.close}>
					<Modal.Header closeButton>
						<Modal.Title><h1>Sign Up</h1></Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Signup />
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.close}>Close</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
});

module.exports = Home;