import path from 'path';
import fs from 'fs';
import { stdout } from 'process';
import { createHash } from 'crypto';
import { OPERATION_ERROR } from '../Constants/constants.js';

class HashOperation {
  constructor() {
    this.path;
  };

  async outputHash(fileName, currentPath) {
    const hash = createHash('sha256');
    hash.setEncoding('hex');   
    this.path = currentPath;
    let pathToFile;
    try {
      if (!path.isAbsolute(fileName)) {
        pathToFile = path.join(this.path, fileName);
      } else {
        pathToFile = fileName;
      }
      const stream = fs.createReadStream(pathToFile);     
      stream
        .on('error', () => console.log(OPERATION_ERROR))
        .pipe(hash)
        .on('error', () => console.log(OPERATION_ERROR))
        .pipe(stdout)
        .on('error', () => console.log(OPERATION_ERROR));
      stream.on('end', () => process.stdout.write('\n'));
    } catch {
      console.log(OPERATION_ERROR);
    }
  };
};

export default new HashOperation();