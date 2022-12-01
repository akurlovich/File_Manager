import os from 'os';

class OsOperation {
  EOL() {
    console.log(JSON.stringify(os.EOL));
  };

  cpus() {
    const cpusInfo = os.cpus().map((item) => {
      return { model: item.model, speed: item.speed / 1000 };
    });
    
    console.log(`You host machine has ${cpusInfo.length} processors: \n`);
    console.log(cpusInfo);

  };

  homedir() {
    console.log(os.homedir());
  };

  username() {
    console.log(os.userInfo().username);
  };

  architecture() {
    console.log(os.arch());
  };
};

export default new OsOperation();
