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
 *
 */
export default class App extends React.Component {

    /**
     *
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            person1: [],
            person2: [],
            person3: [],
            person4: [],
            selectedPerson: [],
            open: false,
        };
    }

    /**
     *
     * @returns {Promise<void>}
     */
    async componentDidMount() {

        this.setState({
            person1:  new Person(await this.queryData()),
            person2:  new Person(await this.queryData()),
            person3:  new Person(await this.queryData()),
            person4:  new Person(await this.queryData()),
        });

    }

    render() {

        const handleClickListItem = (event) => {

            let componentName = event.target.getAttribute('name');
            openModal(this.state[componentName])

        }

        const openModal = (personData) => {
            this.setState({
                open: true,
                selectedPerson: personData,
            })
        }

        const handleClose = () => {
            this.setState({
                open: false,
                selectedPerson: [],
            })
        }

        return <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "90vh"}}>

            <Card style={{width: "80%"}}>

                <Typography variant={"h5"} style={{padding: '10px'}}>
                    Contact List
                </Typography>

                <Divider flexItem style={{height: "1px"}}/>

                {this.state.person4.length < 1 ?

                    <div style={{display: "flex", justifyContent: "center"}}>
                        <CircularProgress style={{padding: "10px"}}/>
                    </div>

                    :

                    <List>
                        <ListItem name={"person1"} button onClick={handleClickListItem}>
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

            <Dialog open={this.state.open} onClose={handleClose}>
                <DialogTitle>{"Full Contact Details"}</DialogTitle>
                <DialogContent>
                    <DialogContentText component={"span"}>
                            <b> Name: </b> {this.state.selectedPerson.formattedName} <br />
                            <b> Email: </b> {this.state.selectedPerson.email} <br />
                            <b> Cell: </b> {this.state.selectedPerson.cell} <br />
                            <b> Location: </b> {this.state.selectedPerson.formattedLocation} <br />
                            <div style={{display: "flex", justifyContent: "center", paddingTop: "15px"}}>
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

    queryData() {

        return new Promise((resolve, reject) => {

            const axios = require('axios');

            axios.get('https://randomuser.me/api/').then((response) => {

                resolve(response.data.results[0]);

            }).catch((error) => {

                reject(error);

            })


        })



    }


}

/**
 *
 */
class Person {

    /**
     *
     * @param userData
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
     *
     * @returns {string}
     */
    get formattedLocation() {

        return this.location.street.number + ' ' +
            this.location.street.name + ' ' +
            this.location.postcode + ', ' +
            this.location.city + ',  ' +
            this.location.state + ', ' +
            this.location.country;

    }

    /**
     *
     * @returns {string}
     */
    get formattedName() {
        return this.name.title + ' ' + this.name.first + ' ' + this.name.last;
    }

}
