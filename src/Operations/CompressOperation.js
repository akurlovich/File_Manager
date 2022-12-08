import path from 'path';
import fs from 'fs';
import { pipeline } from 'stream';
import { OPERATION_ERROR } from '../Constants/constants.js';

class CompressOperation {
  constructor() {
    this.currentPath;
    this.pathToSrc;
    this.pathToDestination;
  }
  setPath(currentPath) {
    this.currentPath = currentPath;
  }
  setPathsToFiles(src, destination) {
    try {
      if (!path.isAbsolute(src)) {
        this.pathToSrc = path.join(this.currentPath, src);
      } else {
        this.pathToSrc = src;
      }
      if (!path.isAbsolute(destination)) {
        this.pathToDestination = path.join(this.currentPath, destination);
      } else {
        this.pathToDestination = destination;
      }
    } catch {
      console.log(OPERATION_ERROR);
    }
  }
  archive(src, destination, archiveProcess) {
    this.setPathsToFiles(src, destination);
    try {
      const compressStream = archiveProcess();
      const srcStream = fs.createReadStream(this.pathToSrc);
      const destinationStream = fs.createWriteStream(this.pathToDestination);
      pipeline(
        srcStream,
        compressStream,
        destinationStream,
        (err) => {
          if (err) {
            console.log(OPERATION_ERROR);
          }
        }
      )
    } catch {
      console.log(OPERATION_ERROR);
    }
  }
  compress(src, destination) {
    if (src && destination) {
      this.archive(src, destination, BrotliCompress);
    } else {
      console.log(OPERATION_ERROR);
    }
  }
  decompress(src, destination) {
    if (src && destination) {
      this.archive(src, destination, BrotliDecompress);
    } else {
      console.log(OPERATION_ERROR);
    }
  }
};

export default new CompressOperation();