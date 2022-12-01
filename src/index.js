import { argv, stdin as input, stdout as output } from 'process';
import * as readline from 'node:readline';
import os from 'os';
import OsOperation from './Operations/SystemOperation.js';
import HashOperation from './Operations/HashOperation.js';
import Navigation from './Operations/Navigation.js';

const home = os.homedir();
const navigation = new Navigation(home);

let userName;
try {
  userName = argv[3].split('=')[1];
} catch {
  console.log('If you want get correct user name, please exit and try again. \n', 
    'Type "npm run start -- --username=your_username" \n',
    'or "node ./src/index.js -- --username=your_username"')
  userName = 'user_name'
};

const cli = readline.createInterface({ input, output });

console.log(`Welcome to File Manager, ${userName}!`);

cli.on('line', (data) => {
  data = data.trim();
  
  if (data === '.exit') {
    cli.close();
  }
  else if (data === 'ls') {
    navigation.ls();
  }
  else if (data === 'up') {
    navigation.up();
  }
  else if (data.startsWith('cd ')) {
    const inputArray = data.split(' ');
    const newPath = inputArray[inputArray.length - 1];
    navigation.cd(newPath);
  }
  else if (data.startsWith('hash ')) {
    const inputArray = data.split(' ');
    const fileName = inputArray[inputArray.length - 1];
    const currentPath = navigation.get();
    HashOperation.outputHash(fileName, currentPath);
  }
  else if (data.startsWith('os ')) {
    try {
      const inputArray = data.split(' ');
      const inputArg = inputArray.filter(item => item.startsWith('--'))[0].slice(2);
      OsOperation[inputArg]();
    } catch {
      console.log('Invalid input');
    }
  }
  else {
    console.log('Invalid input');
  }

});

cli.on('close', () => console.log(`Thank you for using File Manager, ${userName}!`));
