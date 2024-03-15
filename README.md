# Mitigation

A somewhat advanced layer 7 IP filtering mechanism designed to provide a decent ip filtering mechanism and to help withstand heavy ddos attacks

# Getting Started


**Security Options**

The securityOptions object allows you to customize the protection mechanisms according to your requirements. Here are the available security options ( boolean - only true or false accepted):

`blockBadHostname` : Blocks requests with a suspicious or malformed hostname.

`blockRequestFromServers` : Blocks requests coming from known server IPs.

`blockRequestFromVPN` : Blocks requests coming from VPNs.

`blockRequestFromWebProxy` : Blocks requests coming from web proxies.

`blockRequestFromTOR` : Blocks requests coming from the TOR network.

`blockPublicProxy` : Blocks requests coming from public proxy servers.

`blockSearchEngineRobot` : Blocks requests coming from search engine robots.

`blockHostname` : Blocks requests with a specific hostname.

`blockNoProxyIssues` : Blocks requests if no proxy-related issues are detected.



## Usage

Here's how you can use the `mitigation` middleware in your Express.js application:

```javascript
const express = require('express');
const mitigation = require('mitigation');

const app = express();
const port = 3000;

const securityOptions = {
  blockBadHostname: true,
  blockRequestFromServers: true,
  blockRequestFromVPN: true,
  blockRequestFromWebProxy: true,
  blockRequestFromTOR: true,
  blockPublicProxy: true,
  blockSearchEngineRobot: true,
  blockHostname: true,
  blockNoProxyIssues: true
};

//Logging enabled live logs of ip addresses actively being blocked
app.use(mitigation({ logging: true, ...securityOptions }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Express server is listening on port ${port}`);
});
```
# 1.06 Update Features:
`Global Dataset`: Uploads our global dataset of previously checked traffic to serve as a caching mechanism to prevent a ton of outgress traffic

`Improved Console Look` : Looks a tad bit nicer now ;v

# Features Coming Soon:

`Throttling`: Only activate the protection mechanism when a ddos attack is detected.

`Discord Logs` : Import a webhook to get live customizable notifcations of an active attack

# https://discord.gg/WAdFNwWH For Active Support And Setup Help