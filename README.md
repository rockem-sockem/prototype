# prototype

Database used:  
	appdb:  
		users: Registered users    
		fields: Represents descriptions/features of a game. Makes a up the "column".    
		mySession: session storing the current logged user until logout or 14 days expiration.    
	datadb:
		Each collections represents the data fetch from different categories at different times.    
		Format - DEVICE_CATEGORY_YEAR_MONTH_DAY_HOURS_MINUTES (GMT) eg. "IOS_TopFree_2016_5_18_5_21"    
		
=======
Create Admin
		
To create an admin, first sign up as a regular user
so we create a hashed password for the admin and 
then update its role in the mongo shell.

> use DB_NAME /*name of the db where the users collection is*/

> db.COLLECTION_NAME.update( /*collection name of the user's list*/

>    { "username" : ADMIN_NAME },
	
>    { $set: { "role": "admin" }}
	
>  )

=======

SCHEDULING

When starting the server, it'll fetch the first data from just 
one category and then run the scheduler that fetches the remaining
data at a given time, which executes at 1.00am to 1.07am
everyday. 

=======

Small bugs/features/things to consider:

* No cross data.collection update 

* Field data value update only works with selected collection







*Code cleanup(proper file/component names) and documentation!!!

*When re-logging, save the tab where last been.

*Do not display sign up when logged

*For signup, better validation for password or username such as minimal length

*Sort user list.

....Add search for user list.

	
=======
	
More important

*Not sure how bootstrap routing works and may not be 100% restricted proof. 
	
....Research if the tabs are bypassable.

*Initially get the latest scraped data to show.

=======

Fixed / Solution

*Fix login or singing up twice when clicking submit button. (Issue may be in modal). 
	@Solution: Buttoninput was deprecated and so Button was used.
	
*Add enter key listener for all buttons. @Bug: login or singing up twice when pressing enter
	@Solution: Fixed deprecated <Input> and used <FormControl>
	
*Fixed signup/signin being able to trigger multiple times because of async calls
    @Solution: Set a state for waiting to be able to signin/signup	
	
*Fix category code and price not being replaced

*Fix ranking which is hardcoded

*Fix "Add Field" button. Works but refreshes the page or redirects to "localhost:3000/?"