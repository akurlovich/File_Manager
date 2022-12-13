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
    let dataArray = [];
    try {
      const filesList = await readdir(this.path, {withFileTypes: true});
      filesList.sort(
        (a, b) => a.name.localeCompare(b.name, "en")
      );
      for (const file of filesList) {
        if (file.isDirectory()) {
          dataArray.push({Name : file.name, Type: 'Directory'});
        }
      };
      for (const file of filesList) {
        if (file.isFile()) {
          dataArray.push({Name : file.name, Type: 'File'});
        };
        
      };
      console.table(dataArray);
    } catch (error) {
      console.error(OPERATION_ERROR);
    }
  };

  async up() {
    if(this.path !== this.homePath) {
      const currentPath = this.path.split(path.sep);
      currentPath.pop();
      this.path = currentPath.join(path.sep);
    }
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
