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
            peopleArray: [],
            selectedPerson: [], // this is the clicked on contact so that we can pass their data to the dialog / modal
            open: false, // this is whether or not the dialog / modal is open
        };
    }

    /**
     * This routine is called at the beginning of the page loading and grabs our necessary startup data
     * @returns {Promise<void>}
     */
    async componentDidMount() {

        let FourPersonArray = await this.queryData();

        let classCreatedPersonArray = FourPersonArray.map((obj) => (
            new Person(obj)
        ))

        // we can see below that 4 new 'Person' objects are created and the 'this.queryData' function is called on each one
        this.setState({
            peopleArray: classCreatedPersonArray,
        });

    }

    render() {

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
            <Card style={{width: "80%", maxWidth: "800px"}}>

                {/*THIS IS THE TITLE OF THE CONTACT LIST*/}
                <Typography variant={"h5"} style={{padding: '10px'}}>
                    Contact List
                </Typography>

                <Divider flexItem style={{height: "1px"}}/>

                {/*IF THE LAST PERSONS DATA HAS NOT YET LOADED WE DISPLAY A 'CIRCULAR' LOADING ICON*/}
                {this.state.peopleArray.length < 4 ?

                    // again flex is used to centter children
                    <div style={{display: "flex", justifyContent: "center"}}>
                        {/*material-ui circular progress used */}
                        <CircularProgress style={{padding: "10px"}}/>
                    </div>

                    :

                    //IF WE HAVE DATA THEN WE CAN LOAD OUR LIST
                    <List>
                        {/*IF I HAD MORE TIME I WOULD MAKE THIS DYNAMIC AND USE SOMETHING LIKE .MAP IN ORDER TO HAVE A SINGLE <ListItem /> */}
                        {this.state.peopleArray.map((obj, index) => (
                            <ListItem key={index} name={obj.formattedName} button onClick={() => {
                                this.setState({
                                    open: true, // close dialog
                                    selectedPerson: obj, // reset target contact data
                                })
                            }}>
                                {obj.formattedName}
                            </ListItem>

                        ))}

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
            axios.get('https://randomuser.me/api/?results=10&seed=foobar').then((response) => {

                resolve(response.data.results);

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
