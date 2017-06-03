import glob from 'glob';

glob('**/*.spec.js', (err, files) => {
  files.forEach(file => {
    console.log(`\ntesting: ${file}`);
    require(`./${file}`); // eslint-disable-line
  });
  process.exit(0);
});
