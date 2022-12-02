export default (input, navigator, files) => {
  const inputArray = input.split(' ');
  const fileNames = inputArray.filter((fileName, idx) => idx !== 0 && fileName);
  const currentPath = navigator.get();
  files.setPath(currentPath);
  return fileNames;
}