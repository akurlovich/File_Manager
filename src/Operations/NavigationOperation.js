import path from 'path';
import { stat } from 'fs/promises';
import { readdir } from 'node:fs/promises';
import { OPERATION_ERROR } from '../Constants/constants.js';

class Navigation {
  constructor(homePath) {
    this.path = homePath;
    this.homePath = homePath;
  };

  async ls() {
    try {
      // console.log(this.path);
      const filesList = await readdir(this.path);
      console.table(filesList);
    } catch (error) {
      console.error(OPERATION_ERROR);
      // console.log(this.path);
    }
  };

  async up() {
    if(this.path !== this.homePath) {
      const currentPath = this.path.split(path.sep);
      // console.log(currentPath)
      currentPath.pop();
      // console.log(currentPath)
      // console.log(this.path, currentPath, path.sep);
      this.path = currentPath.join(path.sep);
      // this.path = path.join(path.sep, ...currentPath).slice(1);
    }
    // console.log(this.path);
    console.log(`Your current path is ${this.path}`);
  };

  async cd(newPath) {
    if (!path.isAbsolute(newPath)) {
      newPath = path.join(this.path, newPath);
    }
    try {
      const stats = await stat(newPath);
      if (!stats) {
        throw new Error();
      }
      else if (stats.isDirectory()) {
        this.path = newPath;
        console.log(`Your current path is ${this.path}`);
      } else {
        throw new Error();
      }
    } catch (err) {
      console.log('Operation failed!');
    }
  };

  get() {
    return this.path;
  };

  set startPage(homePage) {
    this.homePage = homePage;
    this.path = homePage;
  }
};

export default new Navigation();
