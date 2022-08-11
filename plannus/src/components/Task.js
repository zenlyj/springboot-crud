import React, { useEffect } from 'react'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { Button } from '@mui/material'
import TextField from '@mui/material/TextField'
import api from '../api/backendInterface'
import DialogUtils from './DialogUtils'

function Task(props) {
    const [open, setOpen] = React.useState(false)
    const [hovered, setHovered] = React.useState(false)
    const [name, setName] = React.useState("")
    const [module, setModule] = React.useState("")
    const [timeFrom, setTimeFrom] = React.useState("")
    const [timeTo, setTimeTo] = React.useState("")
    const [description, setDescription] = React.useState("")

    const handleClickOpen = () => {
        if (props.taskPresent) {
            setName(props.name)
            setModule(props.module)
            setTimeFrom(props.timeFrom)
            setTimeTo(props.timeTo)
            setDescription(props.description)
        }
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        props.refreshTimetable()
    }

    const handleSave = () => {
        let response = null
        if (!props.taskPresent) {
            response = api.addTask(name, module, props.timeFrom, timeTo, description, false, props.date)  
        } else {
            response = api.updateTask(props.id, name, module, props.timeFrom, timeTo, description, false, props.date)
        }
        response.then(val => {
            console.log(val)
            if (val.status === 200) {
                handleClose()
            }
            console.log(val.message)
        })
    }

    const handleDelete = () => {
        api.deleteTask(props.id).then(response => {
            if (response.status === 200) {
                handleClose()
            }
            console.log(response.message)
        })
    }

    const defaultButton = () => {
        const defaultButtonStyle = {   
            background: 'transparent',
            border: 0,
            width:'100%',
            height:'30px',
            color: '#a2b2d3',
            fontSize: 20
        }
        return (
            <button
                style={defaultButtonStyle} onMouseOver={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => handleClickOpen()}
            >
                {hovered ? '+' : null}
            </button>
        )
    }

    const taskButton = () => {
        return (
            <Button sx={{width:'100%'}} variant="contained" color="success" onClick={() => handleClickOpen()}>
                {props.name}
            </Button>
        )
    }
    
    return (
        <div>
            {props.taskPresent ? taskButton() : defaultButton()}
            <DialogUtils.BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogUtils.BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    { props.taskPresent ? props.name : 'New Task' }
                </DialogUtils.BootstrapDialogTitle>
                <DialogContent dividers>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Task Name"
                        type="name"
                        fullWidth
                        variant="standard"
                        onChange={e => setName(e.target.value)}
                        defaultValue={props.name}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="module"
                        label="Module"
                        type="module"
                        fullWidth
                        variant="standard"
                        onChange={e => setModule(e.target.value)}
                        defaultValue={props.module}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="timeFrom"
                        label="From"
                        type="timeFrom"
                        fullWidth
                        variant="standard"
                        onChange={e => setTimeFrom(e.target.value)}
                        defaultValue={props.timeFrom}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="timeTo"
                        label="To"
                        type="timeTo"
                        fullWidth
                        variant="standard"
                        onChange={e => setTimeTo(e.target.value)}
                        defaultValue={props.timeTo}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="description"
                        label="Task Description"
                        type="description"
                        fullWidth
                        variant="standard"
                        onChange={e => setDescription(e.target.value)}
                        defaultValue={props.description}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleSave()}>
                        Save
                    </Button>
                    {   props.taskPresent ? 
                            <Button onClick={() => handleDelete()}>
                                Delete
                            </Button> : null
                    }
                </DialogActions>
            </ DialogUtils.BootstrapDialog>
        </div>
    )
}

export default Task