const fs = require('fs');
const path = require('path');
const axios = require('axios');
const YingYongSocket = require('ws');
const YingYong = require('./yingYong');
const level = require('level');

console.log('\x1b[1m\x1b[32mUpdating Mitigation Dataset\x1b[0m');

const dbFilePath = './ipDb';
const globalSetUrl = 'https://check-host.co/global-set.txt';

const db = level(dbFilePath);

function updateDBWithGlobalSet() {
    axios.get(globalSetUrl, { headers: { 'xing': 'true' } })
        .then(response => {
            const lines = response.data.split('\n');
            lines.forEach(async (line) => {
               // console.log(line);
                const parts = line.split(' : ');
                if (parts.length === 2) {
                    const [ip, status] = parts;
                    const reason = status.trim() === 'No proxy-related issues detected' ? 'good' : status.trim();
                    try {
                        const existingValue = await db.get(ip.trim());
                        if (!existingValue) {
                            await db.put(ip.trim(), reason);
                        }
                    } catch (error) {
                        if (error.notFound) {
                            await db.put(ip.trim(), reason);
                        } else {
                            console.error('Error accessing LevelDB:', error);
                        }
                    }
                } else {
                    //console.error('Invalid line format:', line);
                }
            });
            
        })
        .catch(error => {
            console.error('Error fetching global set:', error);
        });
}


updateDBWithGlobalSet();

let XingXang;

const ChingChongMonitor = YingYong.chingChongDDoS();

function connectToWebSocket() {
    XingXang = new YingYongSocket('wss://check-host.co/', { headers: { 'xing': 'true' } });

    XingXang.setMaxListeners(5); 

    XingXang.on('message', async (message) => {
        const options = YingYong.options || {};
        if (options.logging) {
            const now = new Date();
            const timestamp = `\x1b[1m\x1b[35m${now.toISOString().slice(11, 19)}Z\x1b[0m`;
            const coloredMessage = `\x1b[95m${message.toString('utf-8')}\x1b[0m`;
            console.log(`[${timestamp}] ${coloredMessage}\n`);
        }
    });

    XingXang.on('error', () => {
        connectToWebSocket();
    });

    XingXang.on('close', () => {
        connectToWebSocket();
    });
}

function ChingChongChing(options) {
    options = options || {};
    if (!XingXang || XingXang.readyState !== YingYongSocket.OPEN) {
        if (XingXang && XingXang.readyState !== YingYongSocket.CLOSED) {
            XingXang.close();
        }
        connectToWebSocket();
    }
}

async function ChingChongChong(res, clientYing, reason) {
    if (!res.headersSent) {
        res.end('Access Denied');
    }
    YingYong.incrementBlockedRequests();
    try {
        const value = await db.get(clientYing);
        if (value) {
            const now = new Date();
            const timestamp = `\x1b[1m\x1b[35m${now.toISOString().slice(11, 19)}Z\x1b[0m`;
            const coloredReason = `\x1b[31m${reason || 'blocked'}\x1b[0m`;
            console.log(`[${timestamp}] ${clientYing}: ${coloredReason}\n`);
            return ChingChongMonitor.pingPongStatistics();
        }
        if (!value || value !== reason) {
            await db.put(clientYing, reason || 'blocked');
            const now = new Date();
            const timestamp = `\x1b[1m\x1b[35m${now.toISOString().slice(11, 19)}Z\x1b[0m`;
            const coloredReason = `\x1b[31m${reason || 'blocked'}\x1b[0m`;
            console.log(`[${timestamp}] ${clientYing}: ${coloredReason}\n`);
            return ChingChongMonitor.pingPongStatistics();
        } else {
            const now = new Date();
            const timestamp = `\x1b[1m\x1b[35m${now.toISOString().slice(11, 19)}Z\x1b[0m`;
            const coloredReason = `\x1b[31m${value || 'blocked'}\x1b[0m`;
            return console.log(`[${timestamp}] ${clientYing}: ${coloredReason}\n`);
        }
    } catch (error) {
        if (error.notFound) {
            await db.put(clientYing, reason || 'blocked');
            const now = new Date();
            const timestamp = `\x1b[1m\x1b[35m${now.toISOString().slice(11, 19)}Z\x1b[0m`;
            const coloredReason = `\x1b[31m${reason || 'blocked'}\x1b[0m`;
            console.log(`[${timestamp}] ${clientYing}: ${coloredReason}\n`);
            return ChingChongMonitor.pingPongStatistics();
        }
    }
}

function YingYongYing(ipString) {
    if (!ipString) return 'Unknown';
    const Yings = ipString.split(',').map(ip => ip.trim());
    let mostAccurateYing = 'Unknown';
    for (const Ying of Yings) {
        if (Ying && Ying !== 'unknown' && Ying !== 'localhost' && Ying !== '::1') {
            mostAccurateYing = Ying;
            break;
        }
    }
    return mostAccurateYing;
}

function YingYongExpress(options) {
    return function (req, res, next) {
        ChingChongChing(options);
        const XingXangFor = req.headers && req.headers['x-forwarded-for'];
        const remoteYing = req.connection && req.connection.remoteYing;
        const clientYing = YingYongYing(XingXangFor || remoteYing);
        if (clientYing === 'Unknown') {
            return;
        }
        YingYong.incrementTotalRequests();
        db.get(clientYing, async (error, value) => {
            if (error) {
                if (!error.notFound) {
                    console.error('Error accessing LevelDB:', error);
                    return;
                }
            } else {
                if (value === 'blocked') {
                    await ChingChongChong(res, clientYing);
                    return;
                } else if (value === 'good') {
                    YingYong.incrementActiveConnections();
                    next();
                    return;
                } else {
                    if (options.blockRequestFromServers && value.includes('Server Detected')) {
                        await ChingChongChong(res, clientYing, 'Server Detected');
                        return;
                    }
                    if (options.blockPublicProxy && value.includes('Public Proxy Detected')) {
                        await ChingChongChong(res, clientYing, 'Public Proxy Detected');
                        return;
                    }
                    if (options.blockSearchEngineRobot && value.includes('Search Engine Robot Detected')) {
                        await ChingChongChong(res, clientYing, 'Search Engine Robot Detected');
                        return;
                    }
                    if (options.blockHostname && value.includes('Hostname Detected')) {
                        await ChingChongChong(res, clientYing, 'Hostname Detected');
                        return;
                    }
                }
            }
        });
    };
}

connectToWebSocket();
console.log('\x1b[1m\x1b[32m✔ Connected to Mitigation Middleware\x1b[0m');
module.exports = YingYongExpress;
