const dns = require('dns').promises;

async function testDns() {
    try {
        const records = await dns.resolveSrv('_mongodb._tcp.sktrade.ysmeeic.mongodb.net');
        console.log('SRV records found:', records);
    } catch (err) {
        console.error('DNS Resolve Error:', err);
    }
}

testDns();
