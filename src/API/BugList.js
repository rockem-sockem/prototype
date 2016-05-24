var React = require('react');
var $ = require('jquery');

var Table = require('react-bootstrap/lib/Table');
var Button = require('react-bootstrap/lib/Button');

var Image = require('react-bootstrap/lib/Image');
var Carousel = require('react-bootstrap/lib/Carousel');
var Modal = require('react-bootstrap/lib/Modal');

var FormGroup = require('react-bootstrap/lib/FormGroup');
var FormControl = require('react-bootstrap/lib/FormControl');
var ControlLabel = require('react-bootstrap/lib/ControlLabel');
var Panel = require('react-bootstrap/lib/Panel');


var BugFilter = require('./BugFilter');
var Auth = require('../Auth.js');

var displayData; //this variable will hold the data of the game clicked

var BugList = React.createClass({
	render: function() {
		return (
			<div>
				<BugFilter submitHandler={this.loadCollection} />
				<hr />
				<DataDDMenu collections={this.state.collections} cbChangeColl={this.loadCollection} />
				<br />
				<hr />
				<BugTable bugs={this.state.bugs} fields={this.state.fields} refresh={this.loadData} />
			</div>
		)
	},
	getInitialState: function() {
		return {
			bugs: [], // data in collection
			collections: [], // collection holding data 
			fields: [] // new fields that will create the extra column
		};
	},
	componentDidMount: function() {
		this.loadData();
	},
	
	loadData: function() {
		// Initial loading of scraped data for the table
		this.loadCollection({ collName: Auth.getColl() });
		// Initial loading of collections name for dropdown menu
		this.loadDropdown();
		// Initial loading of extra columns in the table
		this.loadColumns();
	},
	loadCollection: function(filter) { // Gets collection according to user selection
		$.ajax('/api/bugs', { data: filter }).done(function(data) {
			this.setState({bugs: data});
		}.bind(this));
		// In production, we'd also handle errors.
	},
	loadDropdown: function() {
		$.ajax('/datadb/collections', {data:{}}).done(function(data) {
			this.setState({collections: data});
		}.bind(this));
	},
	loadColumns: function() {
		$.ajax('/field', {data:{}}).done(function(data) {
			this.setState({fields: data});
		}.bind(this));
	}
});


/**********************************************/
/**** Table Components ************************/
/**********************************************/

var BugTable = React.createClass({
	render: function() {
		var pFields = this.props.fields;
		var fields = this.props.fields.map(function(field) {
			return <Field key={field._id} field={field} />
		});
		var bugRows = this.props.bugs.map(function(bug) {
			return <BugRow key={bug._id} bug={bug} fields={pFields} />
		});
		return (
			<div>
				<Button onClick={this.handleRefresh}>Refresh</Button>
				<br />
				<br />
				<Table striped bordered condensed hover>
					<thead>
						<tr>
							<th>Rank</th>
							<th>Title</th>
							<th>Developer</th>
							<th>Price</th>
							<th>Category</th>
							<th>Device</th>
							{fields}
						</tr>
					</thead>
					<tbody>
						{bugRows}
					</tbody>
				</Table>
			</div>
		)
	},
	getInitialState: function() {
		return{
			bugs: this.props.bugs,

		};
	},
	handleRefresh: function(e) {
		e.preventDefault();
		this.props.refresh();
	}
});

var Field = React.createClass({
	render: function() {
		return(
			<th>{this.props.field.name}</th>
		);
	}
});

var FieldValue = React.createClass({
	render: function() {
		return(
			<td>{this.props.bug[this.props.field.name]}</td>
		);
	}
});

var AndroidTable = React.createClass({
	render: function() {	
		// var versions = this.getVersions();
		var price = (this.props.data.price == "") ? "Free" : this.props.data.price;
		
		return(
			<tbody>
				<tr>
					<td>{this.props.data.title}</td>
					<td><Image src={this.props.data.icon} rounded /></td>
				</tr>
				<tr>
					<td>Description</td>
					<td>{this.props.data.description}</td>
				</tr>
				<tr>
					<td>Genres</td>
					<td>{this.props.genres}</td>
				</tr>
				<tr>
					<td>Latest Version</td>
					<td>{this.props.data.versions[0].version}</td>
				</tr>
				<tr>
					<td>Latest Release Notes</td>
					<td>{this.props.data.versions[0].release_notes}</td>
				</tr>
				<tr>
					<td>Latest Release Date</td>
					<td>{this.props.data.versions[0].release_date}</td>
				</tr>
				<tr>
					<td>Price</td>
					<td>{price}</td>
				</tr>
				
				<tr>
					<td>ScreenShots</td>
					<td>
						<Carousel>
							<Carousel.Item>
							<Image src={this.props.data.screenshots[0]}/>
								<Carousel.Caption>
									<h3>"01"</h3>
								</Carousel.Caption>
							</Carousel.Item>
							<Carousel.Item>
								<Image src={this.props.data.screenshots[1]}/>
								<Carousel.Caption>
									<h3>"02"</h3>
								</Carousel.Caption>
							</Carousel.Item>
							<Carousel.Item>
								<Image src={this.props.data.screenshots[2]}/>
								<Carousel.Caption>
									<h3>F"03"</h3>
								</Carousel.Caption>
							</Carousel.Item>
							<Carousel.Item>
								<Image src={this.props.data.screenshots[3]}/>
								<Carousel.Caption>
									<h3>"04"</h3>
								</Carousel.Caption>
							</Carousel.Item>
						</Carousel>
					</td>
				</tr>
			</tbody>
		);
	},
	
	getVersions: function() {
		var versions = this.props.data.versions;
		var result = [];
		for(var i=0; i < versions.length; i++) {
			var temp = JSON.stringify(versions[i]);
			result.push(temp);
		}
	}
});

var IosTable = React.createClass({
	render: function() {	
		var features = JSON.stringify(this.props.data.features);
		var achievements = (features.game_center) ? "Yes" : "No";
		var inappstore = (features.in_apps) ? "Yes" : "No";
		var genres = this.iterateOverGenres(this.props.data.genres);
		var devices = this.iterateOverDevices(this.props.data.devices);
		
		return(
			<tbody>
				<tr>
					<td>{this.props.data.title}</td>
					<td><Image src={this.props.data.icon} rounded /></td>
				</tr>
				<tr>
					<td>Description</td>
					<td>{this.props.data.description}</td>
				</tr>
				<tr>
					<td>Genres</td>
					<td>{genres}</td>
				</tr>
				<tr>
					<td>Latest Version</td>
					<td>{this.props.data.versions[0].version}</td>
				</tr>
				<tr>
					<td>Release Notes</td>
					<td>{this.props.data.versions[0].release_notes}</td>
				</tr>
				<tr>
					<td>Devices</td>
					<td>{this.props.data.devices}</td>
				</tr>
				<tr>
					<td>Price</td>
					<td>{this.props.data.price}</td>
				</tr>
				<tr>
					<td>Release Date</td>
					<td>{this.props.data.release_date}</td>
				</tr>
				<tr>
					<td>Achievements</td>
					<td>{achievements}</td>
				</tr>
				<tr>
					<td>In-App Store</td>
					<td>{inappstore}</td>
				</tr>
				<tr>
					<td>ScreenShots</td>
					<td>
						<Carousel>
							<Carousel.Item>
							<Image src={this.props.data.screenshots.iphone5[0].url}/>
								<Carousel.Caption>
									<h3>"01"</h3>
								</Carousel.Caption>
							</Carousel.Item>
							<Carousel.Item>
								<Image src={this.props.data.screenshots.iphone5[1].url}/>
								<Carousel.Caption>
									<h3>"02"</h3>
								</Carousel.Caption>
							</Carousel.Item>
							<Carousel.Item>
								<Image src={this.props.data.screenshots.iphone5[2].url}/>
								<Carousel.Caption>
									<h3>F"03"</h3>
								</Carousel.Caption>
							</Carousel.Item>
							<Carousel.Item>
								<Image src={this.props.data.screenshots.iphone5[3].url}/>
								<Carousel.Caption>
									<h3>"04"</h3>
								</Carousel.Caption>
							</Carousel.Item>
						</Carousel>
					</td>
				</tr>
			</tbody>
		);
	},
	iterateOverGenres: function(array) {
		var length = array.length;
		var genres = "";
		for(var i = 0; i < length - 1; i++) {
			var cat;
			switch(array[i]) {
				case 0:
					cat = "All"; break;
				case 6000:
					cat = "Business"; break;
				case 6001:
					cat = "Weather"; break;
				case 6002:
					cat = "Utilities"; break;
				case 6003:
					cat = "Travel"; break;
				case 6004:
					cat = "Sports"; break;
				case 6005:
					cat = "Social Networking"; break;
				case 6006:
					cat = "Reference"; break;
				case 6007:
					cat = "Productivity"; break;
				case 6008:
					cat = "Photo & Video"; break;
				case 6009:
					cat = "News"; break;
				case 6010: 
					cat = "Navigation"; break;
				case 6011:
					cat = "Music"; break;
				case 6012:
					cat = "Lifestyle"; break;
				case 6013:
					cat = "Health & Fitness"; break;
				case 6014:
					cat = "Games"; break;
				case 6015:
					cat = "Finance"; break;
				case 6016:
					cat = "Entertainment"; break;
				case 6017:
					cat = "Education"; break;
				case 6018:
					cat = "Books"; break;
				case 6020:
					cat = "Medical"; break;
				case 6021:
					cat = "Newsstand"; break;
				case 6022:
					cat = "Catalogs"; break;
				case 6023:
					cat = "Food & Drink"; break;
				case 7001:
					cat = "Action"; break;
				case 7002:
					cat = "Adventure"; break;
				case 7003:
					cat = "Arcade"; break;
				case 7004:
					cat = "Board"; break;
				case 7005:
					cat = "Card"; break;
				case 7006:
					cat = "Casino"; break;
				case 7007:
					cat = "Dice"; break;
				case 7008:
					cat = "Educational"; break;
				case 7009:
					cat = "Family"; break;
				case 7010:
					cat = "Kids"; break;
				case 7011:
					cat = "Music"; break;
				case 7012:
					cat = "Puzzle"; break;
				case 7013:
					cat = "Racing"; break;
				case 7014:
					cat = "Role Playing"; break;
				case 7015:
					cat = "Simulation"; break;
				case 7016:
					cat = "Sports"; break;
				case 7017:
					cat = "Strategy"; break;
				case 7018:
					cat = "Trivia"; break;
				case 7019:
					cat = "Word"; break;
				default:
					cat = "undefined"
			}
			genres = genres + ", " + cat;
		}
		return genres;
	},
	iterateOverDevices: function(array) {
		var length = array.length;
		var devices = "";
		for(var i = 0; i < length - 1; i++) {
			devices =  + array[i] + ", " + devices
		}
		return devices;
	}
});

var BugRow = React.createClass({	
	render: function() {
		var bug = this.props.bug;
		var genres = this.formatGenres();
		var devices = this.formatDevices();
		var fieldValues = this.props.fields.map(function(field) {
			return <FieldValue key={field._id} bug={bug} field={field} />
		});
		var iosTable = (this.state.deviceModal == "ios") ?
			<IosTable data={this.state.gameData} /> : <tbody></tbody>;
		var androidTable = (this.state.deviceModal == "android") ?
			<AndroidTable data={this.state.gameData} /> : <tbody></tbody>;
		
		return (
			<tr>
				<td>{this.props.bug.rank}</td>
				<td><img alt="" src={this.props.bug.icon} width="50" height="50" />
					<a onClick={this.fetchData}>{this.props.bug.title}</a></td>
				<td>{this.props.bug.developer}</td>
				<td>{this.props.bug.price}</td>
				<td>{genres}</td>
				<td>{devices}</td>
				{fieldValues}
				<Modal show={this.state.showModal} onHide={this.close}>
					<Modal.Header closeButton>
						<Modal.Title>Data</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Table bordered condensed hover>
							{iosTable}
							{androidTable}
						</Table>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.close}>Close</Button>
					</Modal.Footer>
				</Modal>
			</tr>
		)
	},
	getInitialState: function() {
		return{
			showModal: false,
			gameData: {},
			deviceModal: "" // To identify the correct modal depending on device
		};
	},
	
	formatGenres: function() {
		var genres = "";
		var length = this.props.bug.genres.length;
		
		for(var i=0; i < length; i++) {
			var cur = this.props.bug.genres[i];
			
			if(i < length-1) {
				genres += cur + ", ";
			} else {
				genres += cur;
			}
		}
		return genres;
	},
	formatDevices: function() {
		var devices = "";
		if(this.props.bug.devices == null) {
			return devices;
		}
		
		var length = this.props.bug.devices.length;
		
		for(var i=0; i < length; i++) {
			var cur = this.props.bug.devices[i];
			
			if(i < length-1) {
				devices += cur + ", ";
			} else {
				devices += cur;
			}
		}
		return devices;
	},
	//closes modal
	close: function() {
		this.setState({ showModal: false });
	},
	//opens modal
	open: function() {
		this.setState({ showModal: true });
	},
	//This function sends a get request for the data of a selected game
	fetchData: function() {
		// Initial loading of scraped data for the table
		var device = (this.props.bug.devices == null || this.props.bug.devices == "") 
			? "android" : "ios";
		var id = this.props.bug.id;
		
		var query = {};
		query.id = id;
		query.device = device;

		this.setState({ deviceModal: device	});		
		$.ajax('/api/gameDetails', {data:query}).done(function(data) {
      		this.setState({	gameData: data });
			this.open();
    	}.bind(this));
	}
	//because button doesn't allow conventional way of including two events
	//creating this function to run both fetch and display functions
});




/**********************************************/
/**** Collection Drop-down Menu ***************/
/**********************************************/


var DataDDMenu = React.createClass({
	render: function() {
		var options = this.props.collections.map(function(coll) {
			if(coll.name != "system.indexes") {
				return <DataOptions key={coll.name} collections={coll} />;
			}
		});

		return(
			<Panel>
				<h3>Data Type</h3>
					<form id="dataType">
						<FormGroup controlId="options">
							<FormControl componentClass="select" onChange={this.getSelectedColl}>
								{options}
							</FormControl>
						</FormGroup>
					</form>
			</Panel>
		);
	},
	getSelectedColl: function() {
		var selected = document.forms.dataType.options.value;
		Auth.setColl(selected);
		var query = { collName: Auth.getColl() };
		this.props.cbChangeColl(query);
	}
});



var DataOptions = React.createClass({	
  render: function() {	
		return (
			<option>
				{this.props.collections.name}
			</option>
		)
  }
});

module.exports = BugList;