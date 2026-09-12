const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');

const dir = process.cwd();
const token = process.env.GITHUB_TOKEN;

async function main() {
  if (!token) {
    console.log('NOTE: To push via this script, run:');
    console.log('$env:GITHUB_TOKEN="your_github_personal_access_token"; node git-push.cjs');
    console.log('Or if Git is installed on your terminal, run:');
    console.log('git push -u origin main');
    return;
  }

  console.log('Pushing commit to https://github.com/mitunsri1-maker/LIFE-RPG.git...');
  const pushResult = await git.push({
    fs,
    http,
    dir,
    remote: 'origin',
    ref: 'main',
    onAuth: () => ({ username: token }),
  });
  console.log('Push complete!', pushResult);
}

main().catch(err => {
  console.error('Push error:', err.message);
});
