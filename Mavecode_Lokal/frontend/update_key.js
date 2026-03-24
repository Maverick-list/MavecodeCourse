const { spawnSync } = require('child_process');

console.log('Removing old key...');
spawnSync('npx.cmd', ['vercel', 'env', 'rm', 'GEMINI_API_KEY', 'production', '-y'], { stdio: 'inherit' });

console.log('Adding new key...');
spawnSync('npx.cmd', ['vercel', 'env', 'add', 'GEMINI_API_KEY', 'production'], { 
    input: 'AIzaSyBIA0Mk0BzIgJa8bu63Gg_TcLRrRYKIVd8',
    stdio: ['pipe', 'inherit', 'inherit']
});

console.log('Deploying to production...');
spawnSync('npx.cmd', ['vercel', '--prod', '--yes'], { stdio: 'inherit' });

console.log('All done!');
