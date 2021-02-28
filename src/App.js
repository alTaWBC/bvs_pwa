import "./App.css";
import React, { Component } from "react";

class App extends Component {
    state = {
        audios: [],
        chunks: [],
        recording: false,
    };

    componentDidMount() {
        this.prepareMicrophone();
    }

    prepareMicrophone = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.addEventListener("dataavailable", this.onDataAvailable);
        this.mediaRecorder.addEventListener("stop", this.onStop);
    };

    onStop = ({ data }) => {
        let chunks = [...this.state.chunks, data];
        const blob = new Blob(chunks, { type: "audio/mp4" });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        const audios = [...this.state.audios, audio];
        chunks = [];
        this.setState({ audios, chunks });
    };

    onDataAvailable = ({ data }) => {
        const chunks = [...this.state.chunks, data];
        this.setState({ chunks });
    };

    getButton = (recording) => {
        const clickFunction = recording ? this.stop : this.start;
        const buttonText = recording ? "Stop" : "Start";
        return <button onClick={clickFunction}>{buttonText}</button>;
    };

    stop = () => {
        const MicrophoneIsNotInitialized = this.mediaRecorder === null;
        if (MicrophoneIsNotInitialized) return;

        const MicrophoneIsNotRecording = this.mediaRecorder.state === "inactive";
        if (MicrophoneIsNotRecording) return;

        this.mediaRecorder.stop();
        this.setState({ recording: false });
    };

    start = () => {
        const MicrophoneIsNotInitialized = this.mediaRecorder === null;
        if (MicrophoneIsNotInitialized) return;

        const MicrophoneIsRecording = this.mediaRecorder.state === "recording";
        if (MicrophoneIsRecording) return;

        this.mediaRecorder.start();
        this.setState({ recording: true });
    };

    getAudios = (audios) => {
        return audios.map((_, index) => {
            return (
                <div key={index}>
                    <button onClick={() => this.state.audios[index].play()}>{index}</button>
                </div>
            );
        });
    };

    render() {
        try {
            console.log(this.mediaRecorder?.state);
            const recordButton = this.getButton(this.state.recording);
            const audios = this.getAudios(this.state.audios);

            return (
                <div className="App">
                    {recordButton}
                    {audios}
                </div>
            );
        } catch (e) {
            return <div>{e.message}</div>;
        }
    }
}

export default App;
