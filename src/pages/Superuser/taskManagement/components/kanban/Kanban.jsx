import "../../components/../../../../styling/kanban.css"
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import mockData from '../mockData'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import ClearIcon from '@material-ui/icons/Clear';
import CachedIcon from '@material-ui/icons/Cached';
import CheckIcon from '@material-ui/icons/Check';
import DescriptionIcon from '@material-ui/icons/Description';
import HelpIcon from '@material-ui/icons/Help';
import Card from '../TaskManenagemnet/Card'
import Editable from '../Editabled/Editable'
import { useEffect } from "react"
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import axios from "axios"
import common from "../../../../../baseUrl"
import moment from "moment"
import { DropDownList } from "@progress/kendo-react-dropdowns"


const Kanban = () => {
    const details = JSON.parse(localStorage.getItem('data'))
    const head_admin_id = details?.head_admin_id
    const [data, setData] = useState(mockData)
    const [allAdmins, setAllAdmins] = useState()
    const [currentstatus, setStatus] = useState()
    const [allCards, setAllcards] = useState([])
    const [todo, setTodo] = useState([])
    const [Inprogress, setInprogress] = useState([])
    const [Awaiting, setAwaiting] = useState([])
    const [Completed, setCompleted] = useState([])
    const [notStarted, setNotstarted] = useState([])
    // const [card, setCard] = useState({
    //     id: "",
    //     title: "",
    //     status: "",
    //     created_on: "",
    //     updated_on: "",
    //     assigned_to: "",
    //     assigned_by: "",
    //     deadline: "",

    // })
    // const { id, title, status, created_on, updated_on, assigned_to, assigned_by, deadline } = card;

    // const [isDraging, setIsDragging] = useState()
    useEffect(() => {
        getTasks()
    }, [])

    const getTasks = async () => {
        const url = "TaskManager/GetAllTasksForHeadAdmin/"
        const allTasks = await axios({
            method: "get",
            url: `${common.baseUrl}${url}`,
            headers: {
                Authorization: `Token ${localStorage.getItem("token")}`
            },

        })

        setAllcards(allTasks?.data)


        // let tempcardCopy = [...allCards]
        const toCard = allTasks?.data?.filter(item => item.status === "todo")
        setTodo(toCard)
        // let tempcardCopy1 = [...allCards]
        const toCard1 = allTasks?.data?.filter(item => item.status === "not_started")
        setNotstarted(toCard1)
        const toCard2 = allTasks?.data?.filter(item => item.status === "in_progress")
        setInprogress(toCard2)
        const toCard3 = allTasks?.data?.filter(item => item.status === "dependencies")
        setAwaiting(toCard3)
        const toCard4 = allTasks?.data?.filter(item => item.status === "completed")
        setCompleted(toCard4)


    }
   
    const onDragEnd = result => {
        
        if (!result.destination) return

        const { source, destination, draggableId } = result
        if (source.droppableId !== destination.droppableId) {
            const sourceColIndex = data?.findIndex(e => e.id == source.droppableId)
            const destinationColIndex = data?.findIndex(e => e.id == destination.droppableId)
            const dragedCarIndex = allCards?.findIndex(e => e.id == draggableId)

            const sourceCol = data[sourceColIndex]
            const destinationCol = data[destinationColIndex]

            const sourceTask = sourceCol?.cards

          
            allCards[dragedCarIndex].status = destinationCol?.status
            const cardStatus = allCards[dragedCarIndex].status

          
   


            setStatus(cardStatus)
            updatedStatus(allCards[dragedCarIndex].id, allCards[dragedCarIndex].status);


        }


    }

    const updatedStatus = async (id, status) => {
        const url = `TaskManager/UpdateTask/${id}`
        const updatedTask = await axios({
            method: "patch",
            url: `${common.baseUrl}${url}`,
            data: {
                status: status
            }
        })

        if (updatedTask.status == 200) {
            getTasks()
        }
    }
    const addCard = (status, bId, value, asignedTo, date) => {

        let bIndex = data.findIndex(item => item.id == bId)
        let tempBoard = [...data]
        tempBoard[bIndex].cards.push({
            id: uuidv4(),
            title: value,
            labels: [],
            cards: [],
            description: "",
            status: status,
            created_on: moment(Date.now()).format('YYYY-MM-DD HH:mm'),
            updated_on: moment(Date.now()).format('YYYY-MM-DD HH:mm'),
            assigned_to: asignedTo,
            assigned_by: 2,
            deadline: moment(date).format('YYYY-MM-DD HH:mm')

        })

        setData(tempBoard)

        sendBoardData(bId)


    }


    const sendBoardData = async (bId) => {
        let bIndex = data.findIndex(item => item.id === bId)
        const cards = data[bIndex]?.cards[data[bIndex]?.cards.length - 1]
        const url = "TaskManager/CreateTask";
        const BoardDatares = await axios({
            method: "post",
            url: `${common.baseUrl}${url}`,
            data: cards,


        })
        if (BoardDatares.status == 201) {
            getTasks()
        }

    }
    const DeleteCard = (Bid, CId) => {
        let bIndex = data.findIndex(item => item.id === Bid)
        if (bIndex < 0) return;
        let cIndex = data[bIndex].cards.findIndex(item => item.id === CId)
        let courseCard = data[bIndex].cards[cIndex]
        let tempBoard = [...data]
        tempBoard[bIndex].cards.splice(cIndex, 1)
        setData(tempBoard)
        UpdateCardData(data)
    }



    const updateCard = (bid, cid, card) => {
        const index = allCards.findIndex((item) => item.id === cid);
        if (index < 0) return;

        const tempBoards = allCards;
       

        tempBoards[index] = card;

        setData(tempBoards);
        UpdateCardData(tempBoards)
    };
    const UpdateCardData = async (updatedCard) => {

        const url = "TaskManager/UpdateTask";
        const BoardDatares = await axios({
            method: "post",
            url: `${common.baseUrl}${url}`,
            data: updatedCard,


        })
        if (BoardDatares.status == 201) {
            getTasks()
        }

    };








    return (
        <div className="" >
            <div className="Taskmanagement__Main" >
                <div className="taskmangement_body__head "><h3>Task Management</h3></div>

                <DragDropContext onDragEnd={onDragEnd}>
                    <div className=" taskmangement_body " >
                        <div className="kanban">


                            <Droppable

                                key={"1"}
                                droppableId={"1"}
                            >
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        className='kanban__section'
                                        ref={provided.innerRef}
                                    >
                                        <div className="kanban__section__title">
                                            {
                                                <p>{data[0].title}</p>
                                            }
                                            < ClearIcon />

                                        </div>
                                        <div className="kanban__section__content" id="kanban__section__content">
                                            {
                                                notStarted?.map((task, index) => (
                                                    <Draggable

                                                        key={task.id.toString()}
                                                        draggableId={task?.id.toString()}
                                                        index={index}

                                                    >
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}


                                                            >
                                                                <Card
                                                                    card={task}
                                                                    Bid={"1"}
                                                                    getTasks={getTasks}
                                                                    DeleteCard={DeleteCard}
                                                                    updateCard={updateCard}
                                                                    isDraging={snapshot.isDragging}
                                                                // UpdateCardData = {UpdateCardData}
                                                                >

                                                                </Card>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))
                                            }
                                            {provided.placeholder}

                                        </div>
                                        {/* <Editable
                                            text="Add Task"
                                            placeholder="Enter Card Title"
                                            displayClass="board_add-card"
                                            editClass="board_add-card_edit"
                                            bId={"1"}
                                            dropdown
                                          
                                            onSubmit={(value, asignedTo, date) => addCard(data[0].status, "1", value, asignedTo, date)}
                                        /> */}
                                    </div>
                                )}
                            </Droppable>
                            <Droppable

                                key={"2"}
                                droppableId={"2"}
                            >
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        className='kanban__section'
                                        ref={provided.innerRef}
                                    >
                                        <div className="kanban__section__title">
                                            {
                                                <p>{data[1].title}</p>
                                            }
                                            < DescriptionIcon />

                                        </div>
                                        <div className="kanban__section__content" id="kanban__section__content">
                                            {
                                                todo?.map((task, index) => (
                                                    <Draggable

                                                        key={task?.id.toString()}
                                                        draggableId={task?.id.toString()}
                                                        index={index}

                                                    >
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}


                                                            >
                                                                <Card
                                                                    card={task}
                                                                    Bid={"2"}
                                                                    DeleteCard={DeleteCard}
                                                                    updateCard={updateCard}
                                                                    isDraging={snapshot.isDragging}
                                                                // UpdateCardData = {UpdateCardData}
                                                                >

                                                                </Card>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))
                                            }
                                            {provided.placeholder}

                                        </div>

                                    </div>
                                )}
                            </Droppable>
                            <Droppable

                                key={"3"}
                                droppableId={"3"}
                            >
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        className='kanban__section'
                                        ref={provided.innerRef}
                                    >
                                        <div className="kanban__section__title">
                                            {
                                                <p>{data[2].title}</p>
                                            }
                                            < DonutLargeIcon />

                                        </div>
                                        <div className="kanban__section__content" id="kanban__section__content">
                                            {
                                                Inprogress?.map((task, index) => (
                                                    <Draggable

                                                        key={task?.id.toString()}
                                                        draggableId={task?.id.toString()}
                                                        index={index}

                                                    >
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}


                                                            >
                                                                <Card
                                                                    card={task}
                                                                    Bid={"3"}
                                                                    DeleteCard={DeleteCard}
                                                                    updateCard={updateCard}
                                                                    isDraging={snapshot.isDragging}
                                                                // UpdateCardData = {UpdateCardData}
                                                                >

                                                                </Card>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))
                                            }
                                            {provided.placeholder}

                                        </div>

                                    </div>
                                )}
                            </Droppable>
                            {/* <Droppable

                                key={"4"}
                                droppableId={"4"}
                            >
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        className='kanban__section'
                                        ref={provided.innerRef}
                                    >
                                        <div className="kanban__section__title">
                                            {
                                                <p>{data[3].title}</p>
                                            }
                                            < HelpIcon />

                                        </div>
                                        <div className="kanban__section__content" id="kanban__section__content">
                                            {
                                                Awaiting?.map((task, index) => (
                                                    <Draggable

                                                        key={task.id.toString()}
                                                        draggableId={task.id.toString()}
                                                        index={index}

                                                    >
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}


                                                            >
                                                                <Card
                                                                    card={task}
                                                                    Bid={"4"}
                                                                    DeleteCard={DeleteCard}
                                                                    updateCard={updateCard}
                                                                    isDraging={snapshot.isDragging}
                                                                // UpdateCardData = {UpdateCardData}
                                                                >

                                                                </Card>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))
                                            }
                                            {provided.placeholder}

                                        </div>
                                    </div>
                                )}
                            </Droppable> */}
                            <Droppable

                                key={"5"}
                                droppableId={"5"}
                            >
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        className='kanban__section'
                                        ref={provided.innerRef}
                                    >
                                        <div className="kanban__section__title">
                                            {
                                                data[4].title
                                            }
                                            < CheckIcon />

                                        </div>
                                        <div className="kanban__section__content" id="kanban__section__content">
                                            {
                                                Completed?.map((task, index) => (
                                                    <Draggable

                                                        key={task.id.toString()}
                                                        draggableId={task.id.toString()}
                                                        index={index}

                                                    >
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}


                                                            >
                                                                <Card
                                                                    card={task}
                                                                    Bid={"5"}
                                                                    DeleteCard={DeleteCard}
                                                                    updateCard={updateCard}
                                                                    isDraging={snapshot.isDragging}
                                                                // UpdateCardData = {UpdateCardData}
                                                                >

                                                                </Card>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))
                                            }
                                            {provided.placeholder}

                                        </div>

                                    </div>
                                )}
                            </Droppable>
                        </div>
                    </div>
                </DragDropContext>
            </div>


        </div>
    )
}

export default Kanban