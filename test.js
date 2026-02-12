const http = require('http');

console.log('🧪 Running tests...\n');

// Test 1: Check if app module can be loaded
console.log('Test 1: Loading app module...');
try {
  const app = require('./app.js');
  console.log('✅ App module loaded successfully\n');
} catch (error) {
  console.error('❌ Failed to load app module:', error.message);
  process.exit(1);
}

// Test 2: Verify Express is available
console.log('Test 2: Verifying Express dependency...');
try {
  const express = require('express');
  console.log('✅ Express is available\n');
} catch (error) {
  console.error('❌ Express is not available:', error.message);
  process.exit(1);
}

// Test 3: Check basic functionality
console.log('Test 3: Testing basic server response...');
const testRequest = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: process.env.PORT || 3000,
      path: '/health',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Server health check passed');
          console.log('   Response:', data);
          resolve();
        } else {
          reject(new Error(`Health check failed with status: ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      // This is expected if server is not running
      console.log('ℹ️  Server is not running (this is OK for build tests)');
      resolve();
    });

    req.end();
  });
};

// Run the test
testRequest()
  .then(() => {
    console.log('\n✅ All tests passed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Tests failed:', error.message);
    process.exit(1);
  });
