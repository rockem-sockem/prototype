var React = require('react');
var $ = require('jquery');

var Table = require('react-bootstrap/lib/Table');
var Button = require('react-bootstrap/lib/Button');
var FormGroup = require('react-bootstrap/lib/FormGroup');
var FormControl = require('react-bootstrap/lib/FormControl');
var ControlLabel = require('react-bootstrap/lib/ControlLabel');
var Panel = require('react-bootstrap/lib/Panel');

var BugFilter = require('./BugFilter');
var Auth = require('../Auth.js');

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
			bugs: this.props.bugs
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

var BugRow = React.createClass({	
	render: function() {
		var bug = this.props.bug;
		var genres = this.formatGenres();
		var devices = this.formatDevices();
		var fieldValues = this.props.fields.map(function(field) {
			return <FieldValue key={field._id} bug={bug} field={field} />
		});
		
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
			</tr>
		)
	},
	getInitialState: function() {
		return{
			// bug: this.props.bug
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
	
	//This function sends a get request for the data of a selected game
	fetchData: function() {
		// Initial loading of scraped data for the table
		var query = { 
			id: this.props.bug.id,
			device: (this.props.bug.devices === null) ? "android" : "ios"
		};
		$.ajax('/api/gameDetails', {data:query}).done(function(data) {
      		//this.setState({bugs: data});
      		console.log(data);
    	}.bind(this));
	}
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