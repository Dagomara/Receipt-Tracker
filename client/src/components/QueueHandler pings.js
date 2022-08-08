import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import io from 'socket.io-client';
import 'whatwg-fetch';
import openSocket from 'socket.io-client';

import { HEROKU_ROOT_SERVER, HEROKU_ROOT_CLIENT, CLIENT_ID,
    LOCALHOST_ROOT_SERVER, LOCALHOST_ROOT_CLIENT } from '../assets/js/keys';
var serverRoot;
if (process.env.NODE_ENV == "production") {
   serverRoot = HEROKU_ROOT_SERVER;
}
else {
   serverRoot = LOCALHOST_ROOT_SERVER;
}


const socket = openSocket('http://localhost:3001');


function sendSocketIO() {
  socket.emit('example_message', 'demo');
}

// QueueHandlers handle all socket.io connections! Upon creation,
// they fire a queue-request to the websocket.
export default function QueueHandler(props) {
  const {discordId, avatar, username, qrrPayload, goBack} = props;
  const gameId = qrrPayload.gameId;
  console.log("gameId: ", gameId);
  const [users, setUsers] = useState([]); // players in match with you
  const [avatars, setAvatars] = useState({}); // their avatars, arranged {plyaerId: discordUrl}
  const [playersNeeded, setPlayersNeeded] = useState(0);
  const [queueId, setQueueId] = useState(0);
  const [ownerId, setOwnerId] = useState(""); // who owns the match? 
  const [queueStatus, setQueueStatus] = useState("queueing");

  // socket playings
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);

  // For each discordId in `ids`, will make a "dictionary" of avatarURLs. 
  const makeAvatars = (ids) => {
    let urls = {};
    ids.forEach(e => {
      // make axios request for e's avatarURL
      let temp = {};
      temp[e] = "placeholder image text";
      urls = {...urls, ...temp}
    });
    setAvatars(urls);
  }

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('pong', () => {
      setLastPong(new Date().toISOString());
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, []);

  const sendPing = () => {
    console.log('pinging');
    socket.emit('ping');
  }

  return (
    <div className='text-white'>
      <p>Connected: { '' + isConnected }</p>
      <p>Last pong: { lastPong || '-' }</p>
      <button onClick={ sendPing }>Send ping</button>
      <button onClick={sendSocketIO}>Send Socket.io</button>
    </div>
  );
}