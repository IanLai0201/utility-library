import { execSync } from 'node:child_process';

import fs from 'fs-extra';
import prompts from 'prompts';

async function release() {
  const { version: oldVersion } = fs.readJsonSync('package.json');

  execSync('bump', { stdio: 'inherit' });

  const { version } = fs.readJsonSync('package.json');

  if (oldVersion === version) {
    process.exit();
  }

  execSync('pnpm build', { stdio: 'inherit' });

  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "${version}"`, { stdio: 'inherit' });
  execSync(`git tag -a v${version} -m "v${version}"`, { stdio: 'inherit' });

  const { value } = await prompts({
    type: 'confirm',
    name: 'value',
    message: 'Confirm to proceed with publishing?',
    initial: true,
  });

  if (value) {
    execSync(`cd ./dist && pnpm publish`, { stdio: 'inherit' });
    console.log(`Release success: v${version}`);
  }
}

release();
