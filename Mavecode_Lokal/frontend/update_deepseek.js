const { spawnSync } = require('child_process');
const KEY_NAME = 'DEEPSEEK_API_KEY';
const KEY_VALUE = 'sk-584061be7c1d4a759619bcb3f9a03501';

console.log(`Removing old ${KEY_NAME} if exists...`);
spawnSync('npx.cmd', ['vercel', 'env', 'rm', KEY_NAME, 'production', '-y'], { stdio: 'inherit' });

console.log(`Adding ${KEY_NAME}...`);
spawnSync('npx.cmd', ['vercel', 'env', 'add', KEY_NAME, 'production'], { 
    input: KEY_VALUE,
    stdio: ['pipe', 'inherit', 'inherit']
});

console.log('Deploying to production to apply environment changes...');
spawnSync('npx.cmd', ['vercel', '--prod', '--yes'], { stdio: 'inherit' });

console.log('Environment variable DEEPSEEK_API_KEY is LIVE!');
