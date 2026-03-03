import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";
import './App.css';

// আপনার ফায়ারবেস কনফিগারেশন
const firebaseConfig = {
    apiKey: "AIzaSyCYH0ZSeLjH_T3HJ9hVQ84afB5KyAEZi2Y",
    authDomain: "my-sc-tools.firebaseapp.com",
    databaseURL: "https://my-sc-tools-default-rtdb.firebaseio.com",
    projectId: "my-sc-tools",
    storageBucket: "my-sc-tools.firebasestorage.app",
    messagingSenderId: "285986090017",
    appId: "1:285986090017:web:7fca61fe27e3061db74760",
    measurementId: "G-RX3S0W5PS2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function App() {
  const [statusText, setStatusText] = useState("Calling...");
  const [isMuted, setIsMuted] = useState(false);
  const[isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    const callRef = ref(db, 'calls/call_1');
    const unsubscribe = onValue(callRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.status === 'connected') {
        setStatusText("00:05");
      }
    });
    return () => unsubscribe();
  },[]);

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    set(ref(db, 'calls/call_1/muted'), newMutedState);
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  const endCall = () => {
    set(ref(db, 'calls/call_1/status'), 'ended');
    setStatusText("Call Ended");
    setIsEnded(true);
  };

  return (
    <div className="call-container">
      <div className="user-info">
        <img src="https://via.placeholder.com/150" alt="User" />
        <h2>Abir Hasan</h2>
        <div className="status">{statusText}</div>
      </div>

      <div className="controls">
        <button className={`btn ${isSpeakerOn ? 'active' : ''}`} onClick={toggleSpeaker}>
          <i className="fas fa-volume-up"></i>
        </button>
        <button className={`btn ${isMuted ? 'active' : ''}`} onClick={toggleMute}>
          <i className="fas fa-microphone"></i>
        </button>
        <button 
          className={`btn ${isEnded ? 'btn-ended' : 'btn-end'}`} 
          onClick={endCall} 
          disabled={isEnded}
        >
          <i className="fas fa-phone-slash"></i>
        </button>
      </div>
    </div>
  );
}

export default App;
