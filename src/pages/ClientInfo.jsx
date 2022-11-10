import React, { useState } from 'react'
import "../styling/ClientInfo.css"
// import SaInvvoicePrint from "../../pages/Superadmin/SaInvoicePrint"
import { makeStyles, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core'
import { Link, useHistory, useParams } from 'react-router-dom'

import axios from 'axios'
import logo from "../static/Rectangle  33.png"
import user from "../static/userIcon.png"
import common from '../baseUrl'
import { useEffect } from 'react'
import { height } from '@mui/system'
import { reject } from 'lodash'
import { toast } from 'react-toastify'
import { get } from 'jquery'

const clientPurchase = [
    {
        id: 1,
        name: "kabya",
        price: "493048",
        chassisNo: "fhdu656",
        carModel: "4397nkdf",
        purchaseDate: "20-11-22",

    },
    {
        id: 2,
        name: "pravin",
        price: "493048",
        carModel: "4397nkdf",
        chassisNo: "fhdu656",
        purchaseDate: "20-11-22",

    }
]
const currentPurchase = [
    {
        id: 1,
        name: "kabya",
        price: "493048",
        carModel: "4397nkdf",
        chassisNo: "fhdu656",
        purchaseDate: "20-11-22",

    },
    {
        id: 2,
        name: "pravin",
        price: "493048",
        carModel: "4397nkdf",
        chassisNo: "fhdu656",
        purchaseDate: "20-11-22",

    }
]

function ClientInfo() {
    const [preniew, setPreview] = useState(false)
    const [setBg, setSetBg] = useState(true)
    const [adminAgent, setAdminAgent] = useState(true)
    const [statuMessage, setStatuMessage] = useState()
    const [AllRequests, setAllRequest] = useState()
    // const navigate = useHistory()
    const ClientId = useParams()
    console.log("client id", ClientId);
    const useStyle = makeStyles({

        headRow: {
            backgroundColor: "#8a28d9",

        },
        headCell: {
            color: "#fff",
            fontWeight: "bold",
            fontSize: "20px",
            fontFamily: "montserrat",
            textAlign: "center"


        }, row: {
            color: "white",
            boxShadow: "7px 4px 16px 0px #ccc",
            cursor: "pointer",
            marginTop: "30px",
            paddingLeft: "3rem",
            border: "none",
            position: "relative",
            fontFamily: "Montserrat",
            "&:hover": {
                backgroundColor: "whitesmoke",
                "& $showHid": {
                    maxWidth: "12rem",
                }
            }
        },
        rowdeliverd: {
            color: "white",
            backgroundColor: "#ccc",
            boxShadow: "7px 4px 16px 0px #ccc",
            cursor: "pointer",
            marginTop: "30px",
            paddingLeft: "3rem",
            border: "none",
            position: "relative",
            fontFamily: "Montserrat",
            "&:hover": {
                backgroundColor: "whitesmoke",
                "& $showHid": {
                    maxWidth: "12rem",
                }
            }
        },
        showHid: {
            position: "absolute",
            display: "flex",
            textAlign: "left",
            alignItems: "center",
            height: "100%",
            right: "0",
            maxWidth: "0",
            width: "12rem",
            background: "linear-gradient(90deg, transparent, grey)",
            backdropFilter: "blur(2px)",
            borderTopLeftRadius: "30px",
            borderBottomLeftRadius: "30px",
            transition: ".5s all, liniar"

        },
        TableBodyStyle: {
            height: "5rem",
            overflowY: "auto",
            maxHeight: "2rem"
        },
        invoiceRow: {
            border: "none"
        },
        printBUtton: {
            border: "none",
            background: "transparent",
            fontSize: "13px",
            color: "#8a28d9",
            marginLeft: "2rem",
            cursor: "pointer",
            fontWeight: "700",
            position: "relative"
        },
        cell: {
            border: "none",
            fontFamily: "Montserrat",
            textAlign: "center",
            position: "relative",
            padding: "5px"
        }



    })
    const classes = useStyle()

    //   "cnf_price"
    //   value_type
    // : 
    // "deposits"
    useEffect(() => {
        getAllPurchase()
    }, [])
    const getAllPurchase = async () => {
        const result = await axios({
            method: "get",
            url: `${common.baseUrl}Funds/client-purchases/${ClientId.id}`
        })
        setAllRequest(result.data.results)
    }
    // const sendTrackingLInk = async (trackId, client_id) => {
    //     const url2 = `Tracking/send-tracking-url/`
    //     const purchaseEdit = await axios({
    //         method: "post",
    //         url: `${common.baseUrl}${url2}`,
    //         headers: {
    //             Authorization: `Token ${localStorage.getItem("token")}`
    //         },
    //         data: {
    //             client_id: client_id,
    //             url: `${common.webUrl}tracker/${trackId}`
    //         }

    //     })
    //     if (purchaseEdit.status == 200) {
    //         toast.success("Link Sent Successfully")
    //     }
    // }
    console.log("allrequest", AllRequests);
    return (
        <div className='client_Info'>
            <div className='client_info_sidebar'>
                <div className='logo'>
                    <Link to='/'>
                    <img src={logo} alt="" />
                    </Link>
                </div>

                <div className="sidebar_info">
                    <div className='client_name'>
                        <img src={user} alt="" />
                        <p>{AllRequests?.[0]?.buyer?.name}</p>
                    </div>
                    <div className='client_Email'>
                        <h5>Email:</h5>
                        <p>{`${AllRequests?.[0]?.buyer?.email.slice(0, 18)}..`}</p>
                    </div>
                    <div className='client_name'>
                        <h5>Purchases:</h5>
                        <p>{AllRequests?.length}</p>
                    </div>
                    <div className='client_name'>
                        <h5>Address:</h5>
                        <p>{AllRequests?.[0]?.buyer?.address}</p>
                    </div>
                </div>
            </div>
            <div className='invoicefrom'>

                <div className="invoicefrom__genAndCreateButton">
                    <button onClick={() => { setSetBg(true); setAdminAgent(true) }} className={setBg ? 'std-button-search' : 'std-button-2'}
                    >PREVIOUS</button>
                    <button onClick={() => { setSetBg(false); setAdminAgent(false) }} className={setBg ? 'std-button-2' : 'std-button-search'}>CURRENT</button>
                </div>
                <div className='invoicefrom__GenereateButton__table'>
                    <Table  >
                        <TableHead>
                            <TableRow className={classes.headRow}>
                                <TableCell className={classes.headCell}>Purchase Id</TableCell>
                                <TableCell className={classes.headCell}>Car Model</TableCell>
                                <TableCell className={classes.headCell}>Chassis</TableCell>
                                <TableCell className={classes.headCell}>Price</TableCell>
                                <TableCell className={classes.headCell}>Purchase Date</TableCell>
                                <TableCell className={classes.headCell}>Track</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className={classes.TableBodyStyle}>
                            {
                                adminAgent ?
                                    <>
                                        {
                                            AllRequests?.filter((item) =>
                                                item?.tracker?.is_delivered === true).map((req, key) => {
                                                    return (
                                                        <TableRow className={classes.row} key={req?.id}>
                                                            <TableCell className={classes.cell} > {req?.id}</TableCell>
                                                            <TableCell className={classes.cell}> {req?.cardetails?.model}</TableCell>
                                                            <TableCell className={classes.cell}> {req?.cardetails?.chassis}</TableCell>
                                                            <TableCell className={classes.cell}> {req?.cnf_price}</TableCell>
                                                            <TableCell className={classes.cell}> {req?.purchase_date}</TableCell>
                                                            <TableCell className={classes.cell}>
                                                                <Link to={`/tracker/${req.tracker?.id}`}> <button className='TrackButton'> Track</button></Link>
                                                            </TableCell>


                                                        </TableRow>
                                                    )
                                                })
                                        }

                                    </> :

                                    <>
                                        {
                                            AllRequests?.filter((item) =>
                                                item?.tracker?.is_delivered === false).map((req, key) => {
                                                    return (
                                                        <TableRow className={classes.row} key={req?.id}>
                                                            <TableCell className={classes.cell} > {req?.id}</TableCell>
                                                            <TableCell className={classes.cell}> {req?.cardetails?.model}</TableCell>
                                                            <TableCell className={classes.cell}> {req?.cardetails?.chassis}</TableCell>
                                                            <TableCell className={classes.cell}> {req?.cnf_price}</TableCell>
                                                            <TableCell className={classes.cell}> {req?.purchase_date}</TableCell>
                                                            <TableCell className={classes.cell}>
                                                                <Link to={`/tracker/${req.tracker?.id}`}> <button className='TrackButton'> Track</button></Link>
                                                            </TableCell>


                                                        </TableRow>
                                                    )
                                                })
                                        }
                                    </>
                            }
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default ClientInfo