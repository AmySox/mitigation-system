const express = require('express');
const protectExpress = require('mitigation');

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

app.use(protectExpress({ logging: true, ...securityOptions }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Express server is listening on port ${port}`);
});
