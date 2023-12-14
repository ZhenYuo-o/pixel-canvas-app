// server.js
const WebSocket = require('ws');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    // Handle WebSocket connections here
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
const canvasState = []; // Shared state for the canvas

wss.on('connection', (ws) => {
    // Send current canvas state to the newly connected client
    ws.send(JSON.stringify(canvasState));

    // Handle messages from clients
    ws.on('message', (message) => {
        // Update the canvas state with the received drawing data
        const drawingData = JSON.parse(message);
        canvasState.push(drawingData);

        // Broadcast the updated canvas state to all clients
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(canvasState));
            }
        });
    });
});