import { Grid } from '@material-ui/core';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import StyledEngineProvider from "@mui/material/StyledEngineProvider";
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import "../makeBidDialog.css";
import { error, success } from '../Toast';
import common from '../../baseUrl';
import axios from 'axios';
import { toast } from 'react-toastify';
import { isEmpty, isNull } from 'lodash';


const carFields = Object.keys({
    "client_id": 1,
    "chassis": "",
    "asnet_url": "",
    "make": "VOLKSWAGEN",
    "car_name": "",
    "grade": "TDI4M Hyra DCC Les 4",
    "auction_place": "",
    "purchase_date": "",
    "lot_num": 0,
    "model": "5NDFGF",
    "engine_cc": 0,
    "odo": 1000,
    "color": "gray",
    "tm": "FAT",
    "ac": "AAC",
    "score": "4.5",
    "year": 2022,
    "shipment": ""
})

export default function AddVehicleDialog({ show, setShow, agentId }) {


    const [AllClients, setAllClients] = useState();
    const [OdoVaild, setOdoVaild] = useState(false);
    const [validation, setValidation] = useState({
        lotVaild: false,
        OdoVaild: false,
        dateValid: false,
        engineCCValid: false,
        year: false
    });

    const [details, setDetails] = useState({});


    // useEffect(() => {
    //     setOpen(show);
    // })


    const handleClose = () => {
        setShow(false);

    };

    const handleChange = (e) => {
        console.log("nammmmmm", typeof (e.target.name));
        if (e.target.name == "lot_num") {
            if (!(/^\d*$/.test(e.target.value))) {
                setValidation({ ...validation, lotVaild: true })
                return
            }
            else {
                setValidation({ ...validation, lotVaild: false })
                setDetails({ ...details, [e.target.name]: parseInt(e.target.value) })
                return
            }
        }
        if (e.target.name == "year") {
            if (!(/^\d*$/.test(e.target.value))) {
                setValidation({ ...validation, year: true })
                return
            }
            else {
                setValidation({ ...validation, year: false })
                setDetails({ ...details, [e.target.name]: parseInt(e.target.value) })
                return
            }
        }
        if (e.target.name == "engine_cc") {
            if (!(/^\d*$/.test(e.target.value))) {
                setValidation({ ...validation, engineCCValid: true })
                return
            }
            else {
                setValidation({ ...validation, engineCCValid: false })
                setDetails({ ...details, [e.target.name]: parseInt(e.target.value) })
                return

            }
        }
        if (e.target.name == "odo") {
            if (!(/^\d*$/.test(e.target.value))) {
                setValidation({ ...validation, OdoVaild: true })
                return
            }
            else {
                setValidation({ ...validation, OdoVaild: false })
                setDetails({ ...details, [e.target.name]: parseInt(e.target.value) })
                return
            }
        }
        else {
            setDetails({ ...details, [e.target.name]: e.target.value })
        }
    }
    console.log(details);

    // console.log(details)
    useEffect(async () => {
        const result = await axios({
            method: "post",
            url: `${common.baseUrl}Login/AllClients/`,
            headers: {
                Authorization: `Token ${localStorage.getItem("token")}`
            },
            data: {
                agent_id: agentId
            }
        })
        if (result.status === 200) {
            setAllClients(result.data)
        } else {
            toast.error("Something went wrong while fetching information!")
        }

    }, [])
    const addVehicle = async () => {
        try {
            if (details.client_id) {
                if (details.chassis) {
                    if (details.car_name) {
                        if (details.lot_num && !validation.lotVaild) {
                            if (details.auction_place) {
                                if (details.purchase_date) {
                                    if (details.shipment) {
                                        if (!validation.OdoVaild) {
                                            if (!validation.engineCCValid) {
                                                if (!validation.year) {
                                                    const response = await axios({
                                                        method: "post",
                                                        url: `${common.baseUrl}Funds/create-custom-purchase/`,
                                                        headers: {
                                                            Authorization: `Token ${localStorage.getItem("token")}`
                                                        },
                                                        data: details

                                                    })
                                                    if (response.status == 200) {
                                                        success("Car Added Successfully")

                                                        window.location.reload()
                                                    }
                                                }
                                                else {
                                                    toast.error("Year fieldwill be a number")
                                                }
                                            }
                                            else {
                                                toast.error("Engine CC will be a number")
                                            }

                                        }
                                        else {
                                            toast.error("odo meter will be a number")
                                        }
                                    }
                                    else {
                                        toast.error("Please Select Shipment type")
                                    }
                                }
                                else {
                                    toast.error("Please Enter purchase Date")
                                }
                            }
                            else {
                                toast.error("Please Enter Auction place")
                            }
                        }
                        else {
                            toast.error("Please Enter a valid Lot No")
                        }
                    }
                    else {
                        toast.error("Please Enter car name")
                    }
                }
                else {
                    toast.error("please enter a chassis number")
                }
            }
            else {
                toast.error("please Select a Client")
            }
        } catch (err) {
            error(`Error Adding vehicle: ${err.message}`)
        }

    }
    return (
        <div>
            <StyledEngineProvider injectFirst>
                <Dialog
                    open={show}
                    onClose={handleClose}
                >
                    <h2 style={{ margin: "1rem 1rem 0rem 1rem" }}><span style={{ color: "#8a28d9" }}>Add Vehicle</span></h2>
                    <DialogContent>

                        <Grid spacing={2} container>
                            <Grid xs={6} item>
                                <select className='SleectClientForAdd' onChange={(e) => setDetails({ ...details, [e.target.name]: parseInt(e.target.value) })} name={carFields[0]} id="">
                                    <option value="">Select Client</option>
                                    {
                                        AllClients?.map(clients => {
                                            return (
                                                <option value={clients?.id}>{clients.name}</option>
                                            )
                                        })
                                    }
                                </select>
                            </Grid>

                            {
                                [
                                    "Chassis ID",
                                    "URL of car",
                                    "Make",
                                    "Car Name",
                                    "Grade",
                                    "Auction Place ",
                                    "Purchase Date (YYYY-MM-DD)",
                                    "lot Num",
                                    "Model",
                                    "Engine (cc)",
                                    "Odometer Reading ",
                                    "Color",
                                    "Tm (Transmission) ",
                                    "AC (Air Conditioner) ",
                                    "Score",
                                    "Year"
                                ].map((placeholer, i) => {
                                    return (<Grid xs={6} item>
                                        <input
                                            key={i}
                                            type="text"
                                            name={carFields[i + 1]}
                                            className="std-input2"
                                            placeholder={placeholer}
                                            onChange={handleChange}
                                        />

                                    </Grid>)
                                })}
                            {/* <Grid xs={6} item>
                                <select className='SleectClientForAdd' onChange={(e) => setDetails({ ...details, [e.target.name]: Boolean(e.target.value)})} name={carFields[18]} id="">
                                <option value="">One Price T/F</option>
                                    {
                                        [{key:"True", value:true}, {key:"False", value:false}].map(shipment => {
                                            return (
                                                <option value={shipment.value}>{shipment.key}</option>
                                            )
                                        })
                                    }
                                </select>
                            </Grid> */}
                            <Grid xs={6} item>
                                <select className='SleectClientForAdd' onChange={(e) => setDetails({ ...details, [e.target.name]: e.target.value })} name={carFields[17]} id="">
                                    <option value="">Select Shipment</option>
                                    {
                                        ["RO-RO", "CONTAINER"].map(shipment => {
                                            return (
                                                <option value={shipment}>{shipment}</option>
                                            )
                                        })
                                    }
                                </select>
                            </Grid>
                        </Grid>

                    </DialogContent>
                    <DialogActions style={{ display: "flex", justifyContent: "flex-start", padding: "0 1rem 1rem 1rem" }}>
                        <button
                            style={{ border: "2px solid #8a28d9" }}
                            className="std-button-sun"
                            onClick={addVehicle}
                            autoFocus>
                            Add Vehicle
                        </button>
                        <button
                            style={{ background: "transparent", color: "#8a28d9", border: "2px solid #8a28d9" }}
                            className="std-button-sun" onClick={handleClose}>Close</button>

                    </DialogActions>
                </Dialog>
            </StyledEngineProvider>
        </div>
    )
}
