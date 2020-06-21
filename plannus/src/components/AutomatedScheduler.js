import React, { Component } from 'react'
import PropTypes from "prop-types";
import Popup from 'reactjs-popup'
import Button from 'react-bootstrap/Button'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import InputRange from 'react-input-range'
import moduleslist from '../api/moduleslist.json'
import AutoComplete from './AutoComplete'
import nusmodsAPI from '../api/nusmodsAPI'

class FormTab extends Component {
    constructor(props) {
        super(props)
        this.state = {
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            Monday: 8,
            Tuesday: 8,
            Wednesday: 8,
            Thursday: 8,
            Friday: 8,
            Saturday: 7,
            Sunday: 3
        }
    }
    render() {
        return (
        <Tabs defaultActiveKey="Monday" id="uncontrolled-tab-example">
            {this.state.days.map(day => {
                return (
                    <Tab key={day} eventKey={day} title={day}>
                    <table align="left" className="AutomatedForm">
                        <tbody>
                            <tr>
                                <td colSpan='1'>Start</td>
                                <td colSpan='4'><input name={this.state[day] + '-start'} defaultValue='0900'/></td>
                                <td colSpan='1'></td>
                                <td colSpan='1'>End</td>
                                <td colSpan='4'><input name={this.state[day] + '-end'} defaultValue='1900'/></td>
                            </tr>
                            <tr className="timeSlider">
                                <td colSpan='1'>Workload (hrs):</td>
                                    <td colSpan='10' style={{padding: 20 + 'px'}}>
                                    <InputRange className="timeSlider" maxValue={20} minValue={0} value={this.state[day]} onChange= {(value) => this.setState({
                                        [day]: value
                                    })} />
                                </td>
                                <td colSpan='1'><input type='hidden' name={[day] + '-hours'} value={this.state[day]} /></td>
                            </tr>
                            <tr>
                                <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                            </tr>
                        </tbody>
                    </table>
                    </Tab>
                )
            })}
        </Tabs>
        )
    }
}

class AddedModules extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e) {
        this.props.onChange(e.currentTarget.innerText);
    }

    render() {
        return this.props.modules.map((mc) =>
        <Button className="btn-success modules" key={mc} onClick={this.handleChange}>{mc}</Button>
      )
    }
}

class AutomatedScheduler extends Component {
    static propTypes = {
        defaultModules: PropTypes.instanceOf(Array)
    };

    static defaultProps = {
        defaultModules: []
    };

    constructor(props) {
        super(props)
        this.state = {
            modules: [],
            open: false,
            calculatedWorkload: 0
        }
        this.handleChange = this.handleChange.bind(this);
        this.addModule = this.addModule.bind(this);
        this.removeModule = this.removeModule.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        this.setState({ open: true });
    }
    
    closeModal() {
        this.setState({ open: false });
    }

    handleChange(event) {

    }

    addModule(mc) {
        if (this.state.modules.indexOf(mc) > -1) {
            
        } else {
            let newModules = this.state.modules;
            newModules.push(mc);
            this.setState({
                modules: newModules
            });
        }
        nusmodsAPI.calculateWorkload(this.state.modules).then(hrs => this.setState({calculatedWorkload: hrs}));
    }

    removeModule(mc) {
        let newModules = this.state.modules.filter(p => p != mc);
        this.setState({
            modules: newModules
        });
        nusmodsAPI.calculateWorkload(this.state.modules).then(hrs => this.setState({calculatedWorkload: hrs}));
    }

    render() {
        const buttonStyle = {   
            background: 'transparent',
            border: 0,
            width:'100%',
            height:'30px',
            color: 'white',
            fontSize: 20
        }

        const modalStyle = {
            font: '12px'
        }
        
        const headerStyle = {
            color: 'black',
            width: '100%',
            borderBottom: '1px solid gray',
            fontSize: '18px',
            textAlign: 'center',
            padding: '5px'
        }

        const contentStyle = {
            color: 'black',
            width: '100%',
            padding: '10px 50px'
        }

        const closeStyle = {
            color: 'black',
            cursor: 'pointer',
            position: 'absolute',
            display: 'block',
            padding: '2px 5px',
            lineHeight: '20px',
            right: '-10px',
            top: '-10px',
            fontSize: '24px',
            background: '#ffffff',
            borderRadius: '18px',
            border: '1px solid #cfcece'
        }

        return (
            <div>
                <Button onClick={this.openModal}>Automated Scheduler</Button>
                <Popup 
                    open={this.state.open}
                    closeOnDocumentClick
                    modal
                    onClose={this.closeModal}
                >
                    <div>
                        <a style={closeStyle} onClick={this.closeModal}>
                            &times;
                        </a>
                        <div style={headerStyle}> Automated Scheduler </div>
                        <div style={contentStyle}>
                            <form>
                                <table align="left" className="AutomatedForm">
                                    <tbody>
                                        <tr><td colSpan='1'></td><td colSpan='1'>Calculated Workload:</td><td colSpan='9'><input value={this.state.calculatedWorkload} readOnly /></td><td colSpan='1'></td></tr>
                                        <tr><td colSpan='1'></td><td colSpan='1'>Modules:</td><td colSpan='9'><AutoComplete suggestions={nusmodsAPI.getModuleList(1)} onChange={this.addModule} /></td><td colSpan='1'></td></tr>
                                        <tr><td colSpan='2'></td><td colSpan='9'><AddedModules modules={this.state.modules} onChange={this.removeModule}/></td><td></td></tr>
                                        <tr><td colSpan='1'></td><td colSpan='10'><FormTab/></td><td colSpan='1'></td></tr>
                                        <tr><td colSpan='7'></td><td colSpan='2'><Button className="fullButton btn-secondary">Reset</Button></td><td colSpan='2'><Button className="fullButton btn-success">Automate</Button></td><td colSpan='1'></td></tr>
                                    </tbody>
                                </table>
                            </form>
                        </div>
                        
                    </div>

                </Popup>
            </div>
        )
    }
}

export default AutomatedScheduler