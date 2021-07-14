import React from "react";
import {
    Button,
    Card,
    Dialog,
    DialogActions,
    DialogContent, DialogContentText,
    DialogTitle,
    Divider,
    List,
    ListItem,
    Typography
} from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';

/**
 * this is the top-level react component used in the application
 */
export default class App extends React.Component {

    /**
     * This is all of our initially properties + states
     * @param props if this is passed into <App /> from somewhere else we retain all parent states
     */
    constructor(props) {
        super(props);
        this.state = {
            person1: [], // holder for contact 1
            person2: [], // holder for contact 2
            person3: [], // holder for contact 3
            person4: [], // holder for contact 4
            selectedPerson: [], // this is the clicked on contact so that we can pass their data to the dialog / modal
            open: false, // this is whether or not the dialog / modal is open
        };
    }

    /**
     * This routine is called at the beginning of the page loading and grabs our necessary startup data
     * @returns {Promise<void>}
     */
    async componentDidMount() {

        // we can see below that 4 new 'Person' objects are created and the 'this.queryData' function is called on each one
        this.setState({
            person1:  new Person(await this.queryData()), // when we call this.queryData() we are passing in new profile data to the 'Person' object class
            person2:  new Person(await this.queryData()),
            person3:  new Person(await this.queryData()),
            person4:  new Person(await this.queryData()),
        });

    }

    render() {

        /**
         * This method is called whenever a user clicks on one of the top-level contact list items
         * @param event emitted from click and points to a specific contact
         */
        const handleClickListItem = (event) => {

            let componentName = event.target.getAttribute('name'); // grab the name attribute we defined below
            openModal(this.state[componentName]) // open the dialog / modal to display all information

        }

        /**
         * method for opening the dialog / modal as well as setting the state to the current selected contact
         * @param personData of the contact that was clicked in list
         */
        const openModal = (personData) => {
            this.setState({
                open: true, // opens dialog
                selectedPerson: personData, // sets current target data to display
            })
        }

        /**
         * This method is called either when 'CLOSE' is hit or the user clicks off the dialog / modal
         */
        const handleClose = () => {
            this.setState({
                open: false, // close dialog
                selectedPerson: [], // reset target contact data
            })
        }

        // the div at the top here is written with flexBox in order to center children but also has height set so that it takes up most of the users screen
        return <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "90vh"}}>

            {/*MATERIAL UI CARD USED FOR BACKGROUND*/}
            <Card style={{width: "80%"}}>

                {/*THIS IS THE TITLE OF THE CONTACT LIST*/}
                <Typography variant={"h5"} style={{padding: '10px'}}>
                    Contact List
                </Typography>

                <Divider flexItem style={{height: "1px"}}/>

                {/*IF THE LAST PERSONS DATA HAS NOT YET LOADED WE DISPLAY A 'CIRCULAR' LOADING ICON*/}
                {this.state.person4.length < 1 ?

                    // again flex is used to centter children
                    <div style={{display: "flex", justifyContent: "center"}}>\
                        {/*material-ui circular progress used */}
                        <CircularProgress style={{padding: "10px"}}/>
                    </div>

                    :

                    //IF WE HAVE DATA THEN WE CAN LOAD OUR LIST
                    <List>
                        {/*IF I HAD MORE TIME I WOULD MAKE THIS DYNAMIC AND USE SOMETHING LIKE .MAP IN ORDER TO HAVE A SINGLE <ListItem /> */}
                        <ListItem name={"person1"} button onClick={handleClickListItem}> {/*each list item has its own onClick, name, and inner HTML contents*/}
                            {this.state.person1.formattedName}
                        </ListItem>
                        <ListItem name={"person2"} button onClick={handleClickListItem}>
                            {this.state.person2.formattedName}
                        </ListItem>
                        <ListItem name={"person3"} button onClick={handleClickListItem}>
                            {this.state.person3.formattedName}
                        </ListItem>
                        <ListItem name={"person4"} button onClick={handleClickListItem}>
                            {this.state.person4.formattedName}
                        </ListItem>
                    </List>

                }

            </Card>

            {/*THIS IS THE DIALOG / MODAL THAT OPENS WITH FULL CONTACT INFORMATION*/}
            <Dialog open={this.state.open} onClose={handleClose}>
                <DialogTitle>{"Full Contact Details"}</DialogTitle>
                <DialogContent>
                    {/*we have span here because we have <div> children */}
                    <DialogContentText component={"span"}>
                            {/*format is BOLD FIELD: value*/}
                            <b> Name: </b> {this.state.selectedPerson.formattedName} <br />
                            <b> Email: </b> {this.state.selectedPerson.email} <br />
                            <b> Cell: </b> {this.state.selectedPerson.cell} <br />
                            <b> Location: </b> {this.state.selectedPerson.formattedLocation} <br />
                            {/*FOR THE IMAGE TO LOAD AND BE NICE I PUT IT INSIDE OF A DIV*/}
                            <div style={{display: "flex", justifyContent: "center", paddingTop: "15px"}}>
                                {/*CONDITIONAL LOGIC ON SRC SO THAT IF UNDEFINED DOESNT ERROR*/}
                                <img src={typeof this.state.selectedPerson.portrait !== "undefined" ? this.state.selectedPerson.portrait.large : ""}  alt={"portrait"}/>
                            </div>
                        </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        close
                    </Button>
                </DialogActions>
            </Dialog>

        </div>


    }

    /**
     * This is the function that is responsible for querying the randomuser.me endpoints
     * This function is using the axios library to make a GET request to the endpoint
     * Additionally I have also created a 'Promise' internal to this function so that I can control when it returns
     * @returns {Promise<JSON>} - returns JSON object of a single contacts data
     */
    queryData() {

        // promise for control of async
        return new Promise((resolve, reject) => {

            // import axios library
            const axios = require('axios');

            // send get request and handle response
            axios.get('https://randomuser.me/api/').then((response) => {

                resolve(response.data.results[0]); // resolve promise with data

            }).catch((error) => {

                reject(error); // reject promise if error

            })


        })



    }


}

/**
 * This Person class is the holder for each of our contacts
 * Each contact has the same set of properties as well as helper functions to make our life easier
 */
class Person {

    /**
     * This is where we initialize each contacts data in the class
     * @param userData - passed in by this.queryData()
     */
    constructor(userData) {

        this.gender = userData.gender;
        this.email =  userData.email;
        this.name = userData.name;
        this.portrait = userData.picture;
        this.location =  userData.location;
        this.cell = userData.cell;

    }

    /**
     * This is a helper function I wrote so that we can get a 'clean' location return for displaying in the dialog / modal
     * @returns {string} full location
     */
    get formattedLocation() {

        // basically concats a bunch of fields with some commas / spaces
        return this.location.street.number + ' ' +
            this.location.street.name + ' ' +
            this.location.postcode + ', ' +
            this.location.city + ',  ' +
            this.location.state + ', ' +
            this.location.country;

    }

    /**
     * This helper function returns a formatted full name for easy use in the initial list of contacts shown
     * @returns {string} full name
     */
    get formattedName() {
        return this.name.title + ' ' + this.name.first + ' ' + this.name.last;
    }

}
