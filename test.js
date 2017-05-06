const glob = require('glob');

glob('**/*.spec.js', function (err, files) {
  files.forEach(file => {
    console.log('\ntesting: ' + file);
    require('./'+file);
  });
});
