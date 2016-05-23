var g_username = "";
var g_role = "";
var g_usedColl = "";

module.exports = {
	printLoggedUser() {
		console.log("this g_username = ", g_username);
		console.log("this g_role = ", g_role);
		console.log("this g_usedColl = ", g_usedColl);
	},
	setUsername(username) {
		g_username = username;
	},
	setRole(role) {
		g_role = role;
	},
	setColl(coll) {
		g_usedColl = coll;
	},
	setLoggedUser(data) {
		this.setUsername(data.username);
		this.setRole(data.role);
		this.setColl(data.coll);
		this.printLoggedUser();
	},
	setLogout() {
		g_username = "";
		g_role = "";
		g_usedColl = "";
		this.printLoggedUser();
	},
	getUsername() {
		return g_username;
	},
	getRole() {
		return g_role;
	},
	getColl() {
		return g_usedColl;
	}
}