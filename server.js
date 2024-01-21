require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');
const { TikTokConnectionWrapper, getGlobalConnectionCount } = require('./connectionWrapper');

const app = express();
const httpServer = createServer(app);

const sql = require('mssql');

const config = {
    user: 'DB_A46FF7_panorama_admin',         // Kullanıcı adınız
    password: 'panorama48Dd',     // Şifreniz
    server: 'sql6002.site4now.net',         // Sunucu adresiniz
    database: 'DB_A46FF7_panorama'      // Veritabanı adınız
};


async function upsertUserCount(username, countIncrement) {
    try {
        await sql.connect(config);
        await sql.query`EXEC UpsertUserCount ${username}, ${countIncrement}`;
    } catch (err) {
        console.error('SQL error', err);
    }
}



// JSON içerikler için middleware ekle
app.use(express.json());

// Enable cross origin resource sharing
const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
});


io.on('connection', (socket) => {
    let tiktokConnectionWrapper;

    socket.on('setUniqueId', (uniqueId, options) => {

        // Prohibit the client from specifying these options (for security reasons)
        if (typeof options === 'object') {
            delete options.requestOptions;
            delete options.websocketOptions;
        }

        // Is the client already connected to a stream? => Disconnect
        if (tiktokConnectionWrapper) {
            tiktokConnectionWrapper.disconnect();
        }

        // Connect to the given username (uniqueId)
        try {
            tiktokConnectionWrapper = new TikTokConnectionWrapper(uniqueId, options, true);
            tiktokConnectionWrapper.connect();            
        } catch(err) {
            socket.emit('disconnected', err.toString());
            return;
        }

        // Redirect wrapper control events once
        tiktokConnectionWrapper.once('connected', state => socket.emit('tiktokConnected', state));
        tiktokConnectionWrapper.once('disconnected', reason => socket.emit('tiktokDisconnected', reason));

        // Notify client when stream ends
        tiktokConnectionWrapper.connection.on('streamEnd', () => socket.emit('streamEnd'));

        // Redirect message events
        tiktokConnectionWrapper.connection.on('roomUser', msg => socket.emit('roomUser', msg));
        tiktokConnectionWrapper.connection.on('member', msg => socket.emit('member', msg));
        tiktokConnectionWrapper.connection.on('chat', msg => socket.emit('chat', msg));
        tiktokConnectionWrapper.connection.on('gift', msg => socket.emit('gift', msg));
        tiktokConnectionWrapper.connection.on('social', msg => socket.emit('social', msg));
        tiktokConnectionWrapper.connection.on('like', msg => socket.emit('like', msg));
        tiktokConnectionWrapper.connection.on('questionNew', msg => socket.emit('questionNew', msg));
        tiktokConnectionWrapper.connection.on('linkMicBattle', msg => socket.emit('linkMicBattle', msg));
        tiktokConnectionWrapper.connection.on('linkMicArmies', msg => socket.emit('linkMicArmies', msg));
        tiktokConnectionWrapper.connection.on('liveIntro', msg => socket.emit('liveIntro', msg));
    });

    socket.on('disconnect', () => {
        if(tiktokConnectionWrapper) {
            tiktokConnectionWrapper.disconnect();
        }
    });
});

// Emit global connection statistics
setInterval(() => {
    io.emit('statistic', { globalConnectionCount: getGlobalConnectionCount() });
}, 5000)



app.post('/upsert-count', async (req, res) => {
    try {
        const { username, countIncrement } = req.body;
        await sql.connect(config);
        await sql.query`EXEC UpsertUserCount ${username}, ${countIncrement}`;
        res.status(200).send('Count updated');
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Server error');
    }
});
// Serve frontend files
app.use(express.static('public'));

// Start http listener
const port = process.env.PORT || 4040;
httpServer.listen(port);
console.info(`Server running! Please visit http://localhost:${port}`);
