import React, { Component } from 'react'
import TaskInput from './TaskInput'

class Task extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.initTask
        this.updateTask = this.updateTask.bind(this)
    }

    componentDidUpdate(prevProps) {
        if ((prevProps.initTask.taskPresent !== this.props.initTask.taskPresent) || 
            (prevProps.initTask.taskName !== this.props.initTask.taskName) || 
            (prevProps.initTask.module !== this.props.initTask.module) ||
            (prevProps.initTask.timeTo !== this.props.initTask.timeTo) ||
            (prevProps.initTask.description !== this.props.initTask.description)
        ) {
            this.setState(this.props.initTask)
        }
    }

    updateTask(taskPresent, updatedInfo) {
        let updatedTask = {
            id: this.state.id,
            taskPresent: taskPresent,
            taskName: updatedInfo.taskName,
            module: updatedInfo.module,
            timeFrom: updatedInfo.timeFrom,
            timeTo: updatedInfo.timeTo,
            description: updatedInfo.description
        }
        this.setState(updatedTask)
        this.props.updateTable(updatedTask)
    }   

    render() {
        return (<TaskInput
                    taskInfo={this.state}
                    updateTask={this.updateTask}
                />)
    } 
}

export default Task