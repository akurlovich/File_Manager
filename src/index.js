import { argv, stdin as input, stdout as output } from 'process';
import * as readline from 'node:readline';
import os from 'os';
import OsOperation from './Operations/SystemOperation.js';
import HashOperation from './Operations/HashOperation.js';
import NavigationOperation from './Operations/NavigationOperation.js';
import FilesOperation from './Operations/FilesOperation.js';
import filesOperationModify from './Operations/FilesOperationModify.js';
import CompressOperation from './Operations/CompressOperation.js';

const home = os.homedir();
const navigation = new NavigationOperation(home);

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
  else if (data.startsWith('cat ')) {
    const fileNames = filesOperationModify(data, navigation, FilesOperation);
    FilesOperation.cat(...fileNames);
  }
  else if (data.startsWith('add ')) {
    const fileNames = filesOperationModify(data, navigation, FilesOperation);
    FilesOperation.add(...fileNames);
  }
  else if (data.startsWith('rn ')) {
    const fileNames = filesOperationModify(data, navigation, FilesOperation);
    FilesOperation.rn(...fileNames);
  }
  else if (data.startsWith('cp ')) {
    const fileNames = filesOperationModify(data, navigation, FilesOperation);
    FilesOperation.cp(...fileNames);
  }
  else if (data.startsWith('mv ')) {
    const fileNames = filesOperationModify(data, navigation, FilesOperation);
    FilesOperation.mv(...fileNames);
  }
  else if (data.startsWith('rm ')) {
    const fileNames = filesOperationModify(data, navigation, FilesOperation);
    FilesOperation.rm(...fileNames);
  }
  else if (data === 'ls') {
    navigation.ls();
    // console.log(home);
  }
  else if (data === 'up') {
    navigation.up();
  }
  else if (data.startsWith('cd ')) {
    const inputArray = data.split(' ');
    const newPath = inputArray[inputArray.length - 1];
    console.log(newPath);
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
  else if (data.startsWith('compress ')) {
    const fileNames = filesOperationModify(data, navigation, CompressOperation);
    CompressOperation.compress(...fileNames);
  }
  else if (data.startsWith('decompress ')) {
    const fileNames = filesOperationModify(data, navigation, CompressOperation);
    CompressOperation.decompress(...fileNames);
  }
  else {
    console.log('Invalid input');
  }

});

cli.on('close', () => console.log(`Thank you for using File Manager, ${userName}!`));
