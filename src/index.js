import { argv, stdin as input, stdout as output } from 'process';
import * as readline from 'node:readline';
import os from 'os';
import OSInfo from './Operations/SystemOperation.js';

const home = os.homedir();

let userName;
try {
  userName = argv[3].split('=')[1];
} catch {
  console.log('To get correct user name, please exit and try again. \n', 
    'Type "npm run start -- --username=your_username" \n',
    'or "node ./src/index.js -- --username=your_username"')
  userName = 'user_name'
};

const cli = readline.createInterface({ input, output });

console.log(`Welcome to the File Manager, ${userName}!`);

cli.on('line', (data) => {
  data = data.trim();
  
  if (data === '.exit') {
    cli.close();
  } else if (data.startsWith('os ')) {
      try {
        const commandsArr = data.split(' ');
        const commandName = commandsArr.filter(item => item.startsWith('--'))[0].slice(2);
        OSInfo[commandName]();
      } catch {
        console.log('Invalid input');
      }
  }
  else {
    console.log('Invalid input');
  }

});

cli.on('close', () => console.log(`Thank you for using File Manager, ${userName}!`));
