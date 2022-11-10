import React, { useState } from 'react'
import { TableBody, TableRow, TableHead, TableCell, Table, colors, Pagination, } from '@mui/material'
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import SaInvvoicePrint from "../../pages/Superadmin/SaInvoicePrint"
import "../../styling/saPurchase.css"
import "../../styling/SapurchaseModal.css"
import "../../styling/Invoice.css"
import AddVehicleDialog from '../../component/Dialogs/AddVehicleDialog';
import SapurchaseModal from './SapurchaseModal';
import { makeStyles } from '@material-ui/core';
import { useHistory, withRouter } from 'react-router-dom';
import { useEffect } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import common from '../../baseUrl';
import { set, update } from 'lodash';
// import SapurchaseModalNot from './SapurchaseModalNot';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { toast } from 'react-toastify';
import moment from 'moment';
import ComponentToPrint from './ComponentToPrint';

const BankList = [
  {
    name: "RESONA BANK LTD"
  },
  {
    name: "SUMITOMO MITSUI BANKING CORPORATION"
  }
]
const defaultItemBank = {
  name: "Select Bank"
}
const defaultSwitchCustomer = {
  name: "Select Customer"
}
const selectClinet = {
  name: "Select Client"
}
const defaultCarrier = {
  shipment: "Select Carrier"
}
const data = [
  {
    shipment: "Hoegh Autoliners AS"
  },
  {
    shipment: "Eastern Car Liner Ltd."
  },
  {
    shipment: "YCS"
  },
  {
    shipment: "MOL"
  },
  {
    shipment: "NYK"
  },
  {
    shipment: "K-Line"
  },
  {
    shipment: "Armacup"
  },
  {
    shipment: "Kyowa Shipping Co. Ltd."
  },
  {
    shipment: "Others"
  }
]
const ship = [
  {
    shipname: "RO-RO"
  },
  {
    shipname: "CONTAINER"
  }
]
const defaultShip = {
  shipname: "Select Shipment"
}
function SaPurchase(props) {
  const navigate = useHistory()
  const agent_id = props.match.params.agentId
  const [SelectClient, setSelectClient] = useState([])
  const [DateApi, setDateApi] = useState(false)
  const [resultCount, setResultCount] = useState(0)
  const [List, setList] = useState()
  const [page, setPage] = useState(1)
  const [flagmodal, setFlagmodal] = useState(false)
  const [chesis, setchesis] = useState()
  const [chesisnumber, setchesisNumber] = useState()
  const [ischecked, setisCheked] = useState([])
  const [preniew, setPreview] = useState(false)
  const [purchaseDetails, setPurchasedetails] = useState([])
  const [bankSelect, setbankSelect] = useState(false)
  const [BankName, SetBankName] = useState()
  const [tracker, setTracker] = useState()
  const [invioceData, setINvoiceData] = useState()
  const [editable, setEditable] = useState()
  const [SelectedList, setSelectedList] = useState([])
  const [editCnf, setEditCnf] = useState()
  const [othersCarrier, setOthersCarrier] = useState()
  const [editDepo, setEditDepo] = useState()
  const [cnfPrice, SetcnfPrice] = useState()
  const [depoPrice, SetDeposit] = useState()
  const [allclients, setAllClients] = useState()
  const [switchCustomer, SetSwitchCustomer] = useState()
  const [purchaseId, setPurchaseId] = useState()
  const [show, setShow] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showSwitchModal, setSwitchShowModal] = useState(false)
  const [ShowSortModal, setShowSortModal] = useState(false)
  const [Search, setSearch] = useState({
    purchaseDate: "",
    buyer_name: "",
    tracker_shipping_carrier: "",
    shipment: "",
    startPurchase: "",
    endPurchase: ""
  })

  useEffect(()=>{
    var list = []
    allclients?.forEach(item=>{
      if(item.id !== SelectedList?.[0]?.buyer?.id)
      {
        console.log("buyer")
          list.push(item)
      }
    })
    setSelectClient(list)
    
  },[SelectedList])
  console.log("list ", SelectClient);
  const useStyles = makeStyles({
    row: {
      color: "white",
      boxShadow: "7px 4px 16px 0px #ccc",
      cursor: "pointer",
      paddingLeft: "3rem",
      border: "none",
      fontFamily: "Montserrat",
      "&:hover": {
        backgroundColor: "whitesmoke",
        "& $showHid ": {
          opacity: "1"
        }
      }
    },
    rowNot: {
      color: "white",
      boxShadow: "7px 4px 16px 0px #fff",
      cursor: "pointer",
      backgroundColor: "#ccc",
      paddingLeft: "3rem",
      border: "none",
      fontFamily: "Montserrat",
      "&:hover": {
        backgroundColor: "whitesmoke",
        "& $showHidDelverdNotComplete ": {
          opacity: "1"
        }
      }
    },
    rowdeliverd: {
      color: "white",
      boxShadow: "7px 4px 16px 0px #fff",
      cursor: "pointer",
      paddingLeft: "3rem",
      backgroundColor: "#ccc",
      border: "none",
      fontFamily: "Montserrat",
      "&:hover": {
        backgroundColor: "whitesmoke",
        "& $showHidDelverd": {
          opacity: "1",
        }
      }
    },
    showHid: {
      position: "absolute",
      display: "flex",
      textAlign: "left",
      alignItems: "center",
      height: "75px",
      right: "0",
      opacity: "0",
      background: "linear-gradient(90deg, transparent, grey)",
      backdropFilter: "blur(2px)",
      borderTopLeftRadius: "30px",
      borderBottomLeftRadius: "30px",
      transition: ".5s all, ease-out"

    },
    showHidDelverd: {
      position: "absolute",
      display: "flex",
      textAlign: "left",
      alignItems: "center",
      height: "75px",
      right: "2px",
      opacity: "0",
      background: "linear-gradient(90deg, transparent, grey)",
      backdropFilter: "blur(2px)",
      borderTopLeftRadius: "30px",
      borderBottomLeftRadius: "30px",
      transition: ".5s all, ease-out"

    },
    showHidDelverdNotComplete: {
      position: "absolute",
      display: "flex",
      textAlign: "left",
      alignItems: "center",
      height: "75px",
      right: "0",
      opacity: "0",
      background: "linear-gradient(90deg, transparent, grey)",
      backdropFilter: "blur(2px)",
      borderTopLeftRadius: "30px",
      borderBottomLeftRadius: "30px",
      transition: ".5s all, ease-out"

    },
    invoiceRow: {
      border: "none"
    },
    printBUtton: {
      border: "none",
      background: "transparent",
      fontSize: "13px",
      color: "#8a28d9",
      marginLeft: "1rem",
      cursor: "pointer",
      fontWeight: "700",

    },
    printBUttonDisp: {
      display: "none"
    },
    cell: {
      border: "none",
      fontFamily: "Montserrat",
      textAlign: "center",
      height: "15px",

    }


  });
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#8a28d9",
      color: theme.palette.common.white,
      textAlign: "center",
      height: "15px",
    },
  }));
  const classes = useStyles()

  
  const onItemCheck = (e) => {
    const { value, checked } = e.target
    if (checked) {
      setisCheked([...ischecked, value])
    }
    else {
      setisCheked(ischecked.filter((e) => e !== value))
    }
  }


  useEffect(() => {
    setSelectedList(purchaseDetails?.filter(item => ischecked.includes((item.id).toString())))

  }, [ischecked])


  const handleINvoice = (purchase) => {
    setINvoiceData(purchase)
    setPurchaseId(purchase?.id)
    if (purchase?.bank_name != null) {

      navigate.push('/invoicepreview', purchase, purchaseId)
    }
    else {
      return
    }

  }
  const sendPayRemider = async (purchase) => {
    const purchaseId = purchase?.id
    const url = `Funds/remind-payment/`
    const payReminder = await axios({
      method: "post",
      url: `${common.baseUrl}${url}`,
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`
      },
      data: {
        purchase_id: purchaseId,
        should_remind_agent: true
      }
    })
    if (payReminder.status == 200) {
      toast.success("Reminder sent successfully", {
        autoClose: 1000,
      })
    }

  }
  const handleswitch = ()=>{
     if(SelectedList.length ==1)
     {
      setSwitchShowModal(true)
     }
     else
     {
      toast.warning("You can only switch one purchase at a time")
     }
  }

  const handleInpovicePrint = async (purchase) => {
    setPurchaseId(purchase?.id)
    setbankSelect(true)
    if (BankName?.length >= 1) {

      const url = `Funds/update-bank-name/${purchaseId}`
      const bankUpdate = await axios({
        method: "post",
        url: `${common.baseUrl}${url}`,
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`
        },
        data: {
          bank_name: BankName
        }
      })
      if (bankUpdate.status == 200) {
        toast.success("bank name updated successfully")
        window.location.reload()
        // navigate.push('/invoicepreview', purchase, purchaseId)

      }
    }
    else {

      return

    }
  }

  useEffect(async () => {
    handleShort()

  }, [page])
  useEffect(async () => {
    // handleShort()

    const url2 = `Funds/get-editable-status/${agent_id}`
    const purchaseEdit = await axios({
      method: "get",
      url: `${common.baseUrl}${url2}`,
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`
      },

    })
    setEditable(purchaseEdit.data)
  }, [])
  const handleCnf = (id) => {
    setEditCnf(id)
  }
  const handleDepo = (id) => {
    setEditDepo(id)
  }
  const handleChasis = (id) => {
    setchesis(id)
  }
  const handleChesisSubmit = async (carId) => {
    const response = await axios({
      method: "patch",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`
      },
      url: `${common.baseUrl}Cars/update-chassis-number/${carId}`,
      data: {
        chassis: chesisnumber
      }
    })
    if (response.status == 200) {
      toast.success("Successfully updated", {
        autoClose: 1000,
      })
      // handleShort()
      window.location.reload()
    }
  }
  const handleCnfSubmit = async (id) => {

    if (!cnfPrice) {
      toast.error("Not Input", {
        autoClose: 1000,
      })
      return
    }
    let url = `Funds/update-cnf-price/${id}`
    const updateCnf = await axios({
      method: "post",
      url: `${common.baseUrl}${url}`,
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`
      },
      data: {
        amount: cnfPrice
      }
    })
    if (updateCnf.status == 200) {
      toast.success("Sucessfully updated")
      window.location.reload()
    }

  }
  const handleDepoSubmit = async (id, data) => {
    const cnf = data?.cnf_price
    if (parseInt(depoPrice) > parseInt(cnf)) {
      toast.error("The deposit entered is greater than the CNF price which is not possible.")
      setTimeout(() => {
        window.location.reload()
      }, 3000)
      return
    }
    if (!cnf) {
      toast.error("Deposits can only be updated once cnf price is available.")
      setTimeout(() => {
        window.location.reload()
      }, 3000);
      return
    }
    if (!depoPrice) {
      toast.error("Not Input")
      return
    }
    let url = `Funds/update-deposits/${id}`
    const updatedepo = await axios({
      method: "post",
      url: `${common.baseUrl}${url}`,
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`
      },
      data: {
        amount: depoPrice
      }
    })
    if (updatedepo.status == 200) {
      toast.success("Sucessfully updated")
      window.location.reload()
    }



  }
  const handleDelete = async () => {
    const ids = []

    SelectedList.forEach(item => {
      ids.push(item?.id)
    })
    console.log("puechse id", SelectedList);
    let url = `Funds/delete-purchases/`
    const updatedepo = await axios({
      method: "post",
      url: `${common.baseUrl}${url}`,
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`
      },
      data: {
        ids: ids
      }
    })
    if (updatedepo.status == 200) {
      toast.success("Sucessfully Deleted")
      // window.location.reload()
      handleShort()
    }
  }
  const handleSwitch = async () => {
    const pId = SelectedList?.[0]?.id
    console.log("puechse id", switchCustomer);
    let url = `Funds/update-buyer-in-purchase/${pId}`
    const updatedepo = await axios({
      method: "post",
      url: `${common.baseUrl}${url}`,
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`
      },
      data: {
        id: switchCustomer?.id
      }
    })
    if (updatedepo.status == 200) {
      toast.success("Sucessfully Switched")
      // window.location.reload()
      handleShort()
      setSwitchShowModal(false)
    }
  }

  useEffect(async () => {
    const result = await axios({
      method: "post",
      url: `${common.baseUrl}Login/AllClients/`,
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`
      },
      data: {
        agent_id: parseInt(agent_id)
      }
    })
    if (result.status === 200) {
      setAllClients(result.data)
    } else {
      toast.error("Something went wrong while fetching information!")
    }

  }, [])
  const handleDate = (e) => {
    let date = e.target.value
    date = moment(date).format('YYYY-MM-DD')
    setSearch({ ...Search, startPurchase: date, endPurchase: date })

  }
  const handleShort = async () => {
    if (Search.tracker_shipping_carrier == "Others") {
      setSearch({ ...Search, tracker_shipping_carrier: othersCarrier })
    }
    const url = `Funds/agent-purchases/${agent_id}?page=${Search.startPurchase || Search.endPurchase || Search.buyer_name || Search.shipment || Search?.tracker_shipping_carrier ? 1 : page}&page_size=${5}&start_purchase_date=${Search?.startPurchase === "null" ? "" : Search.startPurchase}&shipment=${Search?.shipment === "null" ? "" : Search?.shipment}&tracker__shipping_carrier=${Search?.tracker_shipping_carrier === "null" ? "" : Search?.tracker_shipping_carrier}&buyer__name=${Search?.buyer_name === "null" ? "" : Search?.buyer_name}&end_purchase_date=${Search.endPurchase === "null" ? "" : Search?.endPurchase}`
    const AllPurchase = await axios({
      method: "get",
      url: `${common.baseUrl}${url}`,
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`
      },
    })
    if (AllPurchase.status == 200) {
      setResultCount(AllPurchase.data?.count)
      setPurchasedetails(AllPurchase.data?.results)
      setShowSortModal(false)

    }
    else {
      toast.error("Something went wrong")
    }

  }

  return (
    <div>
      {
        show && <AddVehicleDialog show setShow={setShow} agentId={agent_id} />
      }
      {
        showModal && <SapurchaseModal onClose={() => setShowModal(false)} SelectedList={SelectedList} flagmodal={flagmodal} class='visibilityMOdal' />
      }
      {
        DateApi && <div style={{ position: "absolute", width: "100%", height: "90vh", background: "transparent" }} onClick={(e) => { e.stopPropagation(); handleShort(); setDateApi(false) }}></div>
      }
      {
        bankSelect &&
        <div className='previewMOdal' onClick={(e) => setbankSelect(false)}>

          <div>
            <div onClick={(e) => e.stopPropagation()} className='bankSelect'>
              <h3 style={{ color: "#8a28d9", marginBottom: "10px" }}>Select Bank</h3>
              <DropDownList

                style={{
                  backgroundColor: "#fff", height: "30px", color: "#000", outline: "none",
                  border: "1px solid grey",

                  borderRadius: "10rem",
                  width: "310px"
                }}
                data={BankList}
                textField="name"
                defaultItem={defaultItemBank}
                onChange={(e) => SetBankName(e.target.value.name)}

              />
              <div className='sapurchase__dateSearch__Right__generate' style={{ width: "15rem" }}><button onClick={handleInpovicePrint}>Generate Invoice</button></div>
            </div>
          </div>

        </div>
      }
      {
        showSwitchModal &&
        <div className='previewMOdal' onClick={(e) => setSwitchShowModal(false)}>

          <div>
            <div onClick={(e) => e.stopPropagation()} className='bankSelect'>
              <h3 style={{ color: "#8a28d9", marginBottom: "10px" }}>Select Customer</h3>
              <DropDownList

                style={{
                  backgroundColor: "#fff", height: "30px", color: "#000", outline: "none",
                  border: "1px solid grey",

                  borderRadius: "10rem",
                  width: "310px"
                }}
                data={SelectClient}
                textField="name"
                defaultItem={defaultSwitchCustomer}
                onChange={(e) => SetSwitchCustomer(e.target.value)}

              />
              <div className='sapurchase__dateSearch__Right__generate' style={{ width: "15rem" }}><button onClick={handleSwitch}>Submit</button></div>
            </div>
          </div>

        </div>
      }
      {
        preniew &&
        <div className='previewMOdal' onClick={(e) => setPreview(false)}>

          <div >
            <div onClick={(e) => e.stopPropagation()} className='previewMOdal__body'>
              {
                preniew && <ComponentToPrint data={invioceData} BankName={BankName} />
              }

            </div>
          </div>

        </div>
      }
      {
        ShowSortModal && <div className=''>
          <div onClick={() => setShowSortModal(!ShowSortModal)} className={`sapurchaseModal ${props.class ? props.class : ""}`} >
            <div onClick={(e) => e.stopPropagation()} className='sapurchaseModal__sort'>
              <div className='sapurchaseModal__sort__title'>
                <h2>Tracking</h2>

              </div>
              <div className='sapurchaseModal__sort__table'>
                <Table>
                  <TableBody>
                    <TableRow >
                      <TableCell className={classes.invoiceRow} style={{ fontWeight: "600", fontSize: "20px" }}>Customer Wise</TableCell>
                      <DropDownList

                        style={{
                          backgroundColor: "#fff", height: "33px", color: "#000", outline: "none",
                          border: "1px solid grey",
                          boxShadow: "7px 4px 16px 0px #ccc",
                          padding: "10px",
                          paddingLeft: "15px",
                          marginTop: "10px",
                          marginLeft: "17px",
                          borderRadius: "10rem",
                          width: "210px"
                        }}
                        data={allclients}
                        textField="name"
                        defaultItem={selectClinet}
                        onChange={(e) => setSearch({ ...Search, buyer_name: e.target.value.name })}

                      />
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.invoiceRow} style={{ fontWeight: "600", fontSize: "20px" }}>Date</TableCell>
                      <TableCell className={classes.invoiceRow}><input style={{
                        backgroundColor: "#fff", height: "33px", color: "#000", outline: "none",
                        border: "1px solid grey",
                        paddingLeft: "15px",
                        borderRadius: "10rem",
                        width: "210px"
                      }} type="date" onChange={handleDate} /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.invoiceRow} style={{ fontWeight: "600", fontSize: "20px" }}>Carrier</TableCell>
                      <DropDownList

                        style={{
                          backgroundColor: "#fff", height: "33px", color: "#000", outline: "none",
                          border: "1px solid grey",
                          boxShadow: "7px 4px 16px 0px #ccc",
                          padding: "10px",
                          marginTop: "10px",
                          paddingLeft: "15px",
                          marginLeft: "17px",
                          borderRadius: "10rem",
                          width: "210px"
                        }}
                        data={data}
                        textField="shipment"
                        defaultItem={defaultCarrier}
                        onChange={(e) => { setTracker(e.target.value.shipment); setSearch({ ...Search, tracker_shipping_carrier: e.target.value.shipment }) }}

                      />

                    </TableRow>
                    <TableRow>
                      {
                        tracker == "Others" && <TableCell className={classes.invoiceRow} style={{ fontWeight: "600", fontSize: "20px" }}></TableCell>
                      }
                      {
                        tracker == "Others" && <input style={{

                          marginLeft: "17px",
                          backgroundColor: "#fff", height: "33px", color: "#000", outline: "none",
                          border: "1px solid grey",
                          paddingLeft: "15px",
                          borderRadius: "10rem",
                          width: "210px"
                        }} type="text" placeholder='Shipment'
                          onChange={(e) => setOthersCarrier(e.target.value)}
                        />
                      }
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.invoiceRow} style={{ fontWeight: "600", fontSize: "20px" }}>Shipment</TableCell>
                      <TableCell className={classes.invoiceRow}>
                        <DropDownList
                          data={ship}
                          textField="shipname"
                          defaultItem={defaultShip}
                          style={{
                            backgroundColor: "#fff", height: "33px", color: "#000", outline: "none",
                            border: "1px solid grey",
                            paddingLeft: "15px",
                            borderRadius: "10rem",
                            width: "210px"
                          }}
                          onChange={(e) => setSearch({ ...Search, shipment: e.target.value.shipname })}
                        /></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className='sapurchaseModal__sort__submit__button'>
                  <button onClick={handleShort}>
                    Sort
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

      }
      <div className='sapurchase'>
        <div className='sapurchase__header__main'>
          <h1 className='sapurchase__header'>Purchases</h1>
          <p onClick={() => setShow(true)}>+</p>
        </div>
        <div className="sapurchase__dateSearch">

          <div className="sapurchase__dateSearch__conatiner">
            <h2>Date Search</h2>
            <div className="sapurchase__dateSearch__left">
              <h3>Start Date</h3>
              <input onChange={(e) => setSearch({ ...Search, startPurchase: moment(e.target.value).format('YYYY-MM-DD') })} type="date" placeholder="yyyy-mm-dd" />
            </div>
            <div className="sapurchase__dateSearch__left">
              <h3>End Date</h3>
              <input onClick={(e) => { e.stopPropagation(); setDateApi(true) }} onChange={(e) => setSearch({ ...Search, endPurchase: moment(e.target.value).format('YYYY-MM-DD') })} style={{ marginLeft: '10px' }} type="date" placeholder="dd-mm-yyyy" />
            </div>
          </div>
          <div className="sapurchase__dateSearch__Right__botton">
            <button onClick={handleswitch} >Switch</button>
            {
              ischecked.length >= 1 ? <button onClick={() => { setShowModal(true) }} >Track</button> : <button onClick={() => { setShowSortModal(true) }} >Track</button>
            }
            <button onClick={() => { SelectedList.length > 0 && handleDelete() }} >Delete</button>

          </div>
        </div>
        <div className='sapurchase__table__container__main'>
          <div className="sapurchase__table__container">
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>
                   </StyledTableCell>
                  <StyledTableCell>Customer Name</StyledTableCell>
                  <StyledTableCell>Chassis No.</StyledTableCell>
                  <StyledTableCell>Auction House</StyledTableCell>
                  <StyledTableCell>Lot No.</StyledTableCell>
                  <StyledTableCell>Purchase Date</StyledTableCell>

                  <StyledTableCell> <div style={{ marginLeft: '30px' }}>C&F Price</div> </StyledTableCell>
                  <StyledTableCell>Deposit</StyledTableCell>
                  {/* <StyledTableCell>Vessel</StyledTableCell> */}
                  <StyledTableCell>Yard Destination</StyledTableCell>
                  <StyledTableCell>Inspection</StyledTableCell>
                  {/* <StyledTableCell>Upload Docs</StyledTableCell> */}
                </TableRow>
              </TableHead>
              <TableBody className='sapurchase__table__body'>
                {
                  purchaseDetails?.map((purchase, i) => (
                    <TableRow className={purchase?.tracker?.is_delivered && purchase?.is_completed ? classes.rowdeliverd : purchase?.tracker?.is_delivered && !purchase?.is_completed ? classes.rowNot : classes.row} key={purchase.id}>

                      <TableCell className={classes.cell}>
                        <input
                          type="checkbox"
                          checked={purchase?.ischecked}
                          className="form-check-input"
                          id="rowcheck{user.id}"
                          value={purchase?.id}
                          onChange={(e) => onItemCheck(e)}

                        /></TableCell>
                      <TableCell className={classes.cell} > {purchase?.buyer?.name}</TableCell>
                      <TableCell className={classes.cell}>
                        {
                          purchase?.cardetails?.chassis.length <= 0 ?
                            <div className='cAndFPrice' style={{ width: "10rem", overflow: "hidden" }}>
                              {
                                chesis == purchase?.id && <input type="text" name="" placeholder='Chassis'
                                  style={{ paddingLeft: "2px" }}
                                  value={chesisnumber}
                                  onChange={(e) => setchesisNumber(chesis == purchase?.id && e.target.value)}
                                />
                              }
                              {
                                !purchase?.cardDetails?.chessis && <>{chesis !== purchase?.id ? <EditIcon onClick={() => handleChasis(purchase.id)} style={{ fontSize: "20px", cursor: "pointer", color: "#8a28d9" }} /> : <CheckIcon onClick={() => handleChesisSubmit(purchase?.cardetails?.id, purchase)} style={{ fontSize: "20px", cursor: "pointer", color: "#8a28d9" }} />}</>
                              }
                            </div> :
                            <>
                              {purchase?.cardetails?.chassis}
                            </>
                        }
                      </TableCell>
                      <TableCell className={classes.cell}> {purchase?.cardetails?.auction_place}</TableCell>
                      <TableCell className={classes.cell}> {purchase?.cardetails?.lot_no}</TableCell>
                      <TableCell className={classes.cell}> {purchase?.purchase_date}</TableCell>

                      <TableCell >
                        <div className='cAndFPrice' style={{ width: "10rem", overflow: "hidden" }}>
                          {
                            editCnf == purchase?.id ? <input type="text" name=""
                              style={{ paddingLeft: "2px" }}
                              value={cnfPrice}
                              defaultValue={purchase?.cnf_price}
                              onChange={(e) => SetcnfPrice(e.target.value)}
                            /> : <div style={{ marginRight: "5px" }}>{purchase?.cnf_price}</div>
                          }
                          {
                            !purchase?.tracker?.is_delivered && <>{editCnf !== purchase?.id ? <EditIcon onClick={() => handleCnf(purchase.id)} style={{ fontSize: "20px", cursor: "pointer", color: "#8a28d9" }} /> : <CheckIcon onClick={() => handleCnfSubmit(purchase?.id)} style={{ fontSize: "20px", cursor: "pointer", color: "#8a28d9" }} />}</>
                          }
                        </div>
                      </TableCell>
                      <TableCell className={classes.cell}>
                        <div className='cAndFPrice' style={{ width: "8rem", overflow: "hidden" }}>
                          {
                            editDepo == purchase?.id ? <input type="text" name=""
                              style={{ paddingLeft: "2px" }}
                              value={depoPrice}
                              defaultValue={purchase?.deposits}
                              onChange={(e) => SetDeposit(e.target.value)}
                            /> : <div style={{ marginRight: "5px" }}>{purchase?.deposits}</div>
                          }
                          {
                            !purchase?.tracker?.is_delivered && <>{editDepo !== purchase?.id ? <EditIcon onClick={() => handleDepo(purchase.id)} style={{ fontSize: "20px", cursor: "pointer", color: "#8a28d9" }} /> : <CheckIcon onClick={() => handleDepoSubmit(purchase?.id, purchase)} style={{ fontSize: "20px", cursor: "pointer", color: "#8a28d9" }} />}</>
                          }
                        </div>
                      </TableCell>
                      {/* <TableCell className={classes.cell}>{purchase?.tracker?.dept_vessel}</TableCell> */}
                      <TableCell className={classes.cell}> {purchase?.tracker?.arrival_port}</TableCell>
                      <TableCell className={classes.cell}> {purchase?.tracker?.inspection_status}</TableCell>

                      <div className={purchase?.is_completed && purchase?.tracker?.is_delivered ? classes.showHidDelverd : purchase?.tracker?.is_delivered && !purchase?.is_completed ? classes.showHidDelverdNotComplete : classes.showHid}>
                        {
                          purchase?.tracker?.is_delivered && <button

                            className={classes.printBUtton} style={{ marginRight: '8px' }}> Car <br /> Delivered</button>
                        }
                        {
                          purchase?.is_completed && <button

                            className={classes.printBUtton} style={{ marginRight: '8px' }}> Payment<br /> Complete</button>
                        }
                        <button
                          onClick={() => { purchase?.bank_name == null ? handleInpovicePrint(purchase) : handleINvoice(purchase) }}
                          className={classes.printBUtton} style={{ marginRight: '8px' }} > {
                            purchase?.bank_name == null ? <p> Generate <br /> Invoice</p> : <p>Download <br /> Invoice</p>
                          } </button>
                        {
                          !purchase?.is_completed && !purchase?.tracker?.is_delivered && <button
                            onClick={() => sendPayRemider(purchase)}
                            className={classes.printBUtton} style={{ marginRight: '8px' }}>Payment <br />Reminder</button>
                        }
                      </div>

                    </TableRow>

                  )

                  )
                }
              </TableBody>
            </Table>

          </div>

        </div>
      </div>
      {Math.ceil(resultCount / 5) > 1 ?
        <Pagination count={Math.ceil(resultCount / 5)} sx={{ mb: 1 }} onChange={(e, pageNumber) => setPage(pageNumber)} /> :
        ''
      }
    </div>
  )
}

export default withRouter(SaPurchase)