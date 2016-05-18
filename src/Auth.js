var g_username = "";
var g_role = "";

module.exports = {
	printLoggedUser() {
		console.log("this g_username = ", g_username);
		console.log("this g_role = ", g_role);
	},
	setUsername(username) {
		g_username = username;
	},
	setRole(role) {
		g_role = role;
	},
	setLoggedUser(data) {
		this.setUsername(data.username);
		this.setRole(data.role);
	},
	setLogout() {
		g_username = "";
		g_role = "";
	},
	getUsername() {
		return g_username;
	},
	getRole() {
		return g_role;
	}
}