class digitalClock extends React.component {
    constructor() {
        state = {
            currentTime: new Date(),
            timer: null
        }
    }
    componentDidMount() {
        let timer = setInterval(() => {
            this.setState({ 'currentTime': new Date });
        }, 1000);
        this.setState({ 'timer': timer });
    }
    render() {
        return (
            <div>
                <span>Clock Time:</span>
                <span>{this.state.currentTime}</span>
            </div>
        );
    }
    componentDidUnmount() {
        clearInterval(this.state.timer);
    }
}

import { useState, useEffect } from 'react';

const digitalClock = props => {

    let [state,setState] = useState({
                    currentTime: new Date(),
                    timer: null
                }, setState);

    useEffect(()=>{
        let timer = setInterval(() => {
                setState({ 'currentTime': new Date });
            }, 1000);
        setState({ 'timer': timer });
        return ()=>{
            clearInterval(this.state.timer);
        }
    });

    return (
        <div>
            <span>Clock Time:</span>
            <span>{this.state.currentTime}</span>
        </div>
    );
}