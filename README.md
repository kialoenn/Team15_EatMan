          #          # My Web Application (EatMan)


* [General info](          #general-info)
* [Technologies](          #technologies)
* [Contents](          #content)

          #          # Live Link
https://eatman.web.app/

          #          # General Info
This browser based web application is to help user find crowdedness of local restaurants and make a quick virtual line-up
	
          #          # Technologies
Technologies used for this project:
* HTML, CSS
* JavaScript
* Bootstrap
* JQuery
* Firebase - Firestore, Authentication
* FontAwesome 5
* simplePagination
* Google Map API
	
          #          # Content
Content of the project folder:

```
 Top level of project folder: 
├── .gitignore                         # Git ignore file
├── 404.html                           # The page to show if a url is not found
├── profile.html                       # The page to show user profile
├── details.html                       # The page to show one restaurant detail
├── index.html                         # The landing page, showing the seach bar
├── login.html                         # The login page for user
├── main.html                          # The main page contain map and list view of restaurant, user queue up restaurant here
├── owner.html                         # The main page for restaurant owner, this is where they track the queue list
├── ownerLogin.html                    # The login page for restaurant owner
├── profile-edit.html                  # The page for user to edit profile
├── queue.html                         # The page to show active queue list for user
├── result.html                        # The page to show search result
├── review.html                        # The page for user to write review
└── README.md

It has the following subfolders and files:
├── .git                               # Folder for git repo
├── images                             # Folder for images
    /45-donald-trump.jpg               # User profile image
    /bacchus.jpg                       # Restaurant image
    /earls.jpg                         # Restaurant image
    /gotham.jpg                        # Restaurant image
    /japadog.jpg                       # Restaurant image
    /noodlebox.jpg                     # Restaurant image
    /searchBg.jpg                      # The index background
    /backgroundProfile.jpeg            # Profile background image
    /greenIcon.png                     # Green map marker icon
    /redIcon.png                       # Red map marker icon
    /logoEatMan.png                    # Website logo
    /radat.png                         # User location icon  
├── scripts                            # Folder for scripts
    /detailFunction.js                 # Functions used for display restaurant detail
    /firebaseAPI.js                    # Store the firebase API key
    /function.js                       # The general function used for every page
    /jquery.simplePagination.js        # The library js file used for pagination
    /mainFunction.js                   # Functions used for main page
    /ownerFunction.js                  # Functions used for owner to display queue list
    /profileFunction.js                # Functions used for display user profile
    /queueDetailFunction.js            # Functions used for display restaurant queue detail
    /resultFunction.js                 # Functions used for display search result
    /reviews.js                        # Functions used for display restaurant detail
    /searchFunction.js                 # Functions used for search 

├── styles                             # Folder for styles
    /editProfileStyle.css              # The style used for editing profile
    /mainStyle.css                     # The style used for main page
    /ownerStyle.css                    # The style used for owner page
    /profile.css                       # The style used for profile page
    /searchStyle.css                   # The style used for search bar


Firebase hosting files: 
├── .firebaserc...


```