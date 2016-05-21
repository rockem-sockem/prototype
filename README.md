# prototype

Database used:
	appdb:
		users: Registered users
		fields: Represents descriptions/features of a game. Makes a up the "column".
		mySession: session storing the current logged user until logout or 14 days expiration.
	datadb:
		Each collections represents the data fetch from different categories at different times.
		Format - DEVICE_CATEGORY_YEAR_MONTH_DAY_HOURS_MINUTES eg. "IOS_TopFree_2016_5_18_5_21"
		
		
To create an admin, first sign up as a regular user
so we create a hashed password for the admin and 
then update its role in the mongo shell.

> use DB_NAME /*name of the db where the users collection is*/

> db.COLLECTION_NAME.update( /*collection name of the user's list*/

>    { "username" : ADMIN_NAME },
	
>    { $set: { "role": "admin" }}
	
>  )

=======

---Small bugs/features/things to consider:

* No cross data.collection update 

* Field data value update only works with selected collection







*Code cleanup(proper file/component names) and documentation!!!

*Add enter key listener for all buttons.

*When re-logging, save the tab where last been.

*Fix deprecated functions.

*FIXED!!!: Fix login or singing up twice. (Issue may be in modal). @REASON: Buttoninput
	was deprecated and so Button was used.

*Design data collection drop-down menu

*Do not display sign up when logged

*For signup, better validation for password or username such as minimal length

*Sort user list.

	Add search for user list.

	
---More important

*Not sure how bootstrap routing works and may not be 100% restricted proof. 
	
	Research if the tabs are bypassable.

*Initially get the latest scraped data to show.

*Code a dropping function for scraped data collection in admin. (Use the collection dropdown menu)