// src/test-sdk.ts
import * as VIAM from '@viamrobotics/sdk';

// Log available types and interfaces
console.log('SDK Object Keys:', Object.keys(VIAM));

// Try to extract DialConf type information if available
// This is just for debugging
const typeSample = {
  host: 'example.com',
  credential: { 
    type: 'api-key',
    payload: 'key-value',
  },
};

console.log('Type sample:', typeSample);