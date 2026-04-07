import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import axios from 'axios';

const program = new Command();

program
  .name('aether')
  .description('AetherBase CLI - Powering your backend')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize a new AetherBase project')
  .action(() => {
    console.log('🚀 Initializing project...');
    const config = {
      projectId: '',
      apiKey: '',
      rules: 'rules.aether'
    };
    fs.writeJsonSync('aether.json', config, { spaces: 2 });
    fs.writeFileSync('rules.aether', 'allow read, write: if true;');
    console.log('✅ Project initialized. Please update aether.json with your credentials.');
  });

program
  .command('deploy')
  .description('Deploy security rules')
  .action(async () => {
    try {
      const config = fs.readJsonSync('aether.json');
      const rules = fs.readFileSync('rules.aether', 'utf8');

      console.log('🛰️  Deploying rules...');
      
      // Need token from somewhere (login)
      const token = fs.readFileSync(path.join(process.env.HOME || process.env.USERPROFILE || '', '.aether_token'), 'utf8');

      const response = await axios.post(`http://localhost:3001/api/projects/rules`, {
        collection: '*',
        rules
      }, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-api-key': config.apiKey
        }
      });

      if (response.data.success) {
        console.log('✅ Rules deployed successfully!');
      }
    } catch (err: any) {
      console.error('❌ Deployment failed:', err.response?.data?.error || err.message);
    }
  });

program.parse();
