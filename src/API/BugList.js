var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');

var Table = require('react-bootstrap/lib/Table');

var BugFilter = require('./BugFilter');

var BugRow = React.createClass({	
	render: function() {
		var genres = this.formatGenres();
		var devices = this.formatDevices();
		

		return (
			<tr>
				<td>{this.props.ranking}</td>
				<td>{this.props.bug.title}</td>
				<td>{this.props.bug.developer}</td>
				<td>{this.props.bug.price}</td>
				<td>{genres}</td>
				<td>{devices}</td>
			</tr>
		)
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

var BugTable = React.createClass({
  render: function() {
    // console.log("Rendering bug table, num items:", this.props.bugs.length);
	var counter = 0;
    var bugRows = this.props.bugs.map(function(bug) {
		return <BugRow key={bug._id} bug={bug} ranking={++counter} />
    });
    return (
		<Table striped bordered condensed hover>
			<thead>
				<tr>
					<th>Rank</th>
					<th>Title</th>
					<th>Developer</th>
					<th>Price</th>
					<th>Category</th>
					<th>Device</th>
				</tr>
			</thead>
			<tbody>
				{bugRows}
			</tbody>
		</Table>
    )
  }
});

var BugList = React.createClass({
	render: function() {
		return (
			<div>
				<BugFilter submitHandler={this.loadData} />
				<hr />
				<DataDDMenu collections={this.state.collections} cbChangeColl={this.changeColl} />
				<br />
				<hr />
				<BugTable bugs={this.state.bugs}/>
			</div>
		)
	},
	getInitialState: function() {
		return {
			bugs: [],
			collections: []
		};
	},
	componentDidMount: function() {
		this.loadData({});
	},
	loadData:function(filter) {
		$.ajax('/api/bugs', {data:filter}).done(function(data) {
			this.setState({bugs: data});
		}.bind(this));
		// In production, we'd also handle errors.
		
		$.ajax('/api/datadbCollections', {data:filter}).done(function(data) {
			this.setState({collections: data});
		}.bind(this));
	},
	
	
	changeColl: function() {
		var filter = {};
		$.ajax('/api/bugs', {data:filter}).done(function(data) {
			this.setState({bugs: data});
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