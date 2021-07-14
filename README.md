#Address Book Client
- Simple single page application that will display a list of randomly generated 'fake' users
- Upon clicking of a contact a Dialog / Modal window will appear with additional details (portrait, location, phone, email) 

#Run Instructions
- Clone repo into local IDE
- 'NPM INSTALL' should be run to get all dependencies 
- 'NPM START' is the command to run the application 


#Deploy Instructions
- Application is currently only 'react-app'


- In order to deploy the following tasks must be undertaken:
    - Server.js server needs to be written + compression
    - Webpack.config.js needs to be defined (bundle.js)
    - Webpack-build command needs to be defined (gzip)
    - Tests should be written if production deploy
    

- Cloud Deploy 
    - Project must be created on Google Cloud Platform
    - All necessary cloud build APIs need to be enabled
    - Google Cloud CLI must be downloaded + authenticated
    - Google Cloud CLI must be opened and the following steps taken:
        - GCLOUD CONFIG SET PROJECT {X}
        - CD {working_directory}
        - GCLOUD APP DEPLOY

#Assignment Summary
- Single page application developed in React
- Material UI library used 
- Flexbox used to center | center 'contact list'
- When initially loading a 'circularProgress' icon is shown until contacts exist
- Dynamically loads 4 random contacts and at list level displays their full name 
- Once contacts are loaded interactive list each name can be clicked
- Once you click a contact name the 'dialog / modal' menu pop-ups and displays the contacts (name, email, cell, location, & portrait image)

