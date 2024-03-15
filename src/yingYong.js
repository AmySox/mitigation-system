let totalRequests = 0;
let blockedRequests = 0;
let activeConnections = 0;
let prevLogLength = 0;
let intervalId;

function pingPongStatistics() {
  const statsString = `\x1b[2K\x1b[1mAttempted Requests:\x1b[0m \x1b[36m${totalRequests}\x1b[0m - \x1b[1mBlocked IPS:\x1b[0m \x1b[31m${blockedRequests}\x1b[0m - \x1b[1mBypassed Requests:\x1b[0m \x1b[32m${activeConnections}\x1b[0m\n`;
  process.stdout.write(statsString);
  process.stdout.write('\u001b[1A');
  process.stdout.write('\u001b[1A');
  process.stdout.clearLine(); 

}

function chingChongDDoS() {
  return {
    pingPongStatistics: pingPongStatistics,
    incrementTotalRequests: incrementTotalRequests,
    decrementTotalRequests: decrementTotalRequests,
    incrementBlockedRequests: incrementBlockedRequests,
    incrementActiveConnections: incrementActiveConnections,
    decrementActiveConnections: decrementActiveConnections,
    getTotalRequests: () => totalRequests
  };
}

function incrementTotalRequests() {
  totalRequests++;
}

function decrementTotalRequests() {
  totalRequests--;
}

function incrementBlockedRequests() {
  blockedRequests++;
}

function incrementActiveConnections() {
  activeConnections++;
}

function decrementActiveConnections() {
  activeConnections--;
}

module.exports = {
  chingChongDDoS,
  incrementTotalRequests,
  decrementTotalRequests,
  incrementBlockedRequests,
  incrementActiveConnections,
  decrementActiveConnections
};
