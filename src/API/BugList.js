var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');

var Table = require('react-bootstrap/lib/Table');
var Button = require('react-bootstrap/lib/Button');

var BugFilter = require('./BugFilter');



var BugList = React.createClass({
	render: function() {
		return (
			<div>
				<BugFilter submitHandler={this.loadData} />
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
		this.loadData({});
	},
	
	
	loadData:function(filter) {
		// Initial loading of scraped data for the table
		$.ajax('/api/bugs', {data:filter}).done(function(data) {
			this.setState({bugs: data});
		}.bind(this));
		// Initial loading of collections name for dropdown menu
		this.loadDropdown();
		// Initial loading of extra columns in the table
		this.loadColumns();
	},
	loadCollection: function() { // Gets collection according to user selection
		$.ajax('/api/bugs', {data:{}}).done(function(data) {
			this.setState({bugs: data});
		}.bind(this));
		// In production, we'd also handle errors.
	},
	loadDropdown: function() {
		$.ajax('/api/datadbCollections', {data:{}}).done(function(data) {
			this.setState({collections: data});
		}.bind(this));
	},
	loadColumns: function() {
		$.ajax('/field', {data:{}}).done(function(data) {
			this.setState({fields: data});
		}.bind(this));
	},
	addBug: function(bug) {
		$.ajax({
			type: 'POST', url: '/api/bugs', contentType: 'application/json',
			data: JSON.stringify(bug),
			success: function(data) {
				var bug = data;
				// We're advised not to modify the state, it's immutable. So, make a copy.
				var bugsModified = this.state.bugs.concat(bug);
				this.setState({bugs: bugsModified});
			}.bind(this),
			error: function(xhr, status, err) {
				// ideally, show error to user.
				console.log("Error adding bug:", err);
			}
		});
	}
});


/**********************************************/
/**** Table Components ************************/
/**********************************************/

var BugTable = React.createClass({
	render: function() {
		var counter = 0;
		var pFields = this.props.fields;
		var fields = this.props.fields.map(function(field) {
			return <Field key={field._id} field={field} />
		});
		var bugRows = this.props.bugs.map(function(bug) {
			return <BugRow key={bug._id} bug={bug} ranking={++counter} fields={pFields} />
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
				<td>{this.props.ranking}</td>
				<td>{this.props.bug.title}</td>
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
			<select id="coll" onChange={this.getSelectedColl}>
				{options}
			</select>
		);
	},
	getSelectedColl: function() {
		var selected = document.getElementById("coll").value;
		var query = {name: selected};
		
		$.ajax({
			type: 'POST', url: '/api/changeDatadbCollection', 
			contentType: 'application/json',
			data: JSON.stringify(query),
			success: function() {
				this.props.cbChangeColl();
			}.bind(this),
			error: function(xhr, status, err) {
				// ideally, show error to user.
				console.log("Error changing collections:", err);
			}
		});
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