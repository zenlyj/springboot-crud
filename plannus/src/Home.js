import React, { useEffect } from "react";
import Timetable from './components/Timetable'
import Button from 'react-bootstrap/Button'
import moduleslist from './api/moduleslist.json'
import AutoComplete from './components/AutoComplete'
import nusmodsAPI from './api/nusmodsAPI'
import AutomatedScheduler from './components/AutomatedScheduler'
import DeadlineList from './components/DeadlineList'
import TaskImport from './components/TaskImport'
import api from './api/backendInterface'

function Home(props) {
    const [tasks, setTasks] = React.useState([])
    const [deadlines, setDeadlines] = React.useState([])
    const [weekNum, setWeekNum] = React.useState(1)

    useEffect(() => {
        getTasks()
        getDeadlines()
    }, [])

    const navWeek = (diff) => {
        // allow user to navigate between week 1 and 13
        let updated = weekNum+diff
        if (updated <= 0) {
            updated = weekNum
        }
        if (updated > 13) {
            updated = 13
        }
        setWeekNum(updated)
    }

    const getTasks = () => {
        api.getStudentTasks(1).then(response => {
            if (response.status === 200) {
                const newTasks = JSON.parse(response.data)
                setTasks(newTasks)
            }
            console.log(response.message)
        })
    }

    const getDeadlines = () => {
        api.getStudentDeadlines(1).then(response => {
            if (response.status === 200) {
                const header = [{isHeader:true}]
                const retreivedDeadlines = JSON.parse(response.data)
                setDeadlines(header.concat(retreivedDeadlines))
            }
            console.log(response.message)
        })
    }

    const refresh = () => {
        getTasks()
        getDeadlines()
    }

    return (
        <div>
            <div style={{width:'100%', marginTop:'2%'}}> 
                <Button variant="outline-dark" style={{float:'left', marginLeft:'30%', width:'2.5%'}} onClick={()=>navWeek(-1)}> {'<'} </Button>
                <h3 style={{float:'left', textAlign:'center', marginLeft:'2%', width:'10%', color:'#404040'}}> {'Week ' + weekNum} </h3> 
                <Button variant="outline-dark" style={{float:'left', marginLeft:"2%", width:'2.5%'}} onClick={()=>navWeek(1)}> {'>'} </Button>
            </div>
            <div style={{marginLeft:'13%', paddingTop:'2%'}}>
                <div style={{marginLeft:'80%', paddingBottom:'1%'}}> <TaskImport refresh={refresh}/> </div>
            </div>
            <div style={{marginLeft:'13%', width:'87%'}}>
                    <div style={{display: 'inline-block', width:'85%'}}> <Timetable id={weekNum} week={weekNum} tasks={tasks} refresh={refresh}/> </div>
                    <div style={{display: 'inline-block', verticalAlign:'top', marginLeft:'3%', width:'12%'}}> <DeadlineList deadlines={deadlines} refresh={refresh}/> </div>
            </div>
            <div style={{marginLeft:'14%'}}> <AutomatedScheduler key={weekNum} id={weekNum} automateSchedule={props.automateSchedule} /> </div>
        </div>
    )
}

export default Home