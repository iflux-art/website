const { execSync } = require('child_process');

try {
  console.log('Current branch:');
  console.log(execSync('git branch --show-current').toString());
  
  console.log('Checking out main branch...');
  execSync('git checkout main');
  
  console.log('New branch:');
  console.log(execSync('git branch --show-current').toString());
} catch (error) {
  console.error('Error:', error.message);
}
