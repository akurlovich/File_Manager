import path from 'path';
import fs from 'fs';
import fsp from 'fs/promises';
import { stat } from 'fs/promises';
import { pipeline } from 'stream';
import { OPERATION_ERROR } from '../Constants/constants.js';

class Files {
  constructor() {
    this.pathToDir = '';
  }

  setPath(currentPath) {
    this.pathToDir = currentPath;
  }

  async cat(fileName) {
    const pathToFile = path.join(this.pathToDir, fileName);

    try {
      if (fs.existsSync(pathToFile)) {
        const stream = fs.createReadStream(pathToFile, 'utf8');
        stream.pipe(process.stdout);
        stream.on('end', () => process.stdout.write('\n'));
      } else {
        throw new Error(OPERATION_ERROR);
      }
    } catch {
      console.log(OPERATION_ERROR);
    }
  };

  async add(fileName) {
    const pathToFile = path.join(this.pathToDir, fileName);
    
    try {
      if (fs.existsSync(pathToFile)) {
        throw new Error(OPERATION_ERROR);
      } else {
        fs.writeFileSync(pathToFile, '');
        console.log(`File ${pathToFile} created!`);
      }
    } catch (err) {
      console.error(OPERATION_ERROR);
    };
  };

  async rn(pathToFile = '', newFilename = '') {
    const oldPathToFile = path.join(this.pathToDir, pathToFile);
    const newPathToFile = path.join(this.pathToDir, newFilename);

    try {
      if (fs.existsSync(oldPathToFile) && !fs.existsSync(newPathToFile)) {
        fs.renameSync(oldPathToFile, newPathToFile);
        console.log(`File ${oldPathToFile} renamed to ${newPathToFile}`);
      } else {
        throw new Error(OPERATION_ERROR);
    
      }
    } catch (err) {
      console.error(OPERATION_ERROR);
    };
  };

  async rm(fileName) {
    const pathToFile = path.join(this.pathToDir, fileName);
    console.log(pathToFile);

    try {
      if (fs.existsSync(pathToFile)) {
        fs.rmSync(pathToFile);
        console.log(`File ${pathToFile} was removed!`);
      } else {
        throw new Error(OPERATION_ERROR);
    
      }
    } catch (err) {
      console.error(OPERATION_ERROR);
    };
  };

  async cp(pathToFile, newPathToDir, errMessage = OPERATION_ERROR) {
    let src;
    let fileName;
    let destination;
    let destinationDir;

    if (!path.isAbsolute(pathToFile)) {
      src = path.join(this.pathToDir, pathToFile);
      fileName = pathToFile;
    } else {
      const pathToDir = pathToFile.split(path.sep);
      fileName = pathToDir.pop();
      src = pathToFile;
    }
    if (!path.isAbsolute(newPathToDir)) {
      destination = path.join(this.pathToDir, newPathToDir, fileName);
      destinationDir = path.join(this.pathToDir, newPathToDir);
    } else {
      destination = path.join(newPathToDir, fileName);
      destinationDir = newPathToDir;
    }
    try {
      await fsp.mkdir(destinationDir, { recursive: true });
      try {
        await fsp.access(destination);
        throw new Error('File exist')
      } catch (err) {
        if (err.message !== 'File exist') {
          try {
            await fsp.access(src);
            const srcStream = fs.createReadStream(src);
            const destinationStream = fs.createWriteStream(destination);
            pipeline(
              srcStream,
              destinationStream,
              (err) => {
                if (err) {
                  console.log(errMessage);
                  return '';
                }
              }
            )
          } catch {
            console.log(errMessage);
            return '';
          }
        } else {
          console.log(errMessage);
          return '';
        }
      }
    } catch {
      console.log(errMessage);
      return '';
    }
    return src;
  }
  async mv(pathToFile, newPathToDir) {  
      const src = await this.cp(pathToFile, newPathToDir, '');
      fs.rm(src, err => {
        if (err) console.log(OPERATION_ERROR);
      });  
  }
};

export default new Files();
