const git = require('isomorphic-git');
const fs = require('fs');
const path = require('path');

const dir = process.cwd();

async function main() {
  console.log('Initializing git repository...');
  await git.init({ fs, dir, defaultBranch: 'main' });

  console.log('Finding and adding files...');
  
  // Recursively find all tracked files
  function getFiles(currentDir, relativePath = '') {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    let files = [];
    for (const entry of entries) {
      const name = entry.name;
      if (name === '.git' || name === 'node_modules' || name === 'dist' || name === '.env') continue;
      const fullPath = path.join(currentDir, name);
      const rel = relativePath ? `${relativePath}/${name}` : name;
      if (entry.isDirectory()) {
        files = files.concat(getFiles(fullPath, rel));
      } else {
        if (!name.endsWith('.db') && !name.endsWith('.db-wal') && !name.endsWith('.db-shm') && !name.endsWith('.log')) {
          files.push(rel);
        }
      }
    }
    return files;
  }

  const allFiles = getFiles(dir);
  console.log(`Found ${allFiles.length} files to track.`);

  for (const filepath of allFiles) {
    await git.add({ fs, dir, filepath });
  }

  console.log('Creating commit...');
  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'mitunsri1-maker',
      email: 'mitunsri1@users.noreply.github.com',
    },
    message: 'feat: LIFE//OS — AAA 3D Cyberpunk Life RPG full-stack application',
  });

  console.log(`Commit created: ${sha}`);

  console.log('Setting remote origin...');
  await git.addRemote({
    fs,
    dir,
    remote: 'origin',
    url: 'https://github.com/mitunsri1-maker/LIFE-RPG.git',
    force: true,
  });

  console.log('Repository initialized and committed successfully!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
