const fs = require('fs');
const archiver = require('archiver');
const path = require('path');

// Source and destination directories
const sourceDir = './';
const destinationDir = './zip_files';

// List of folders to copy and zip
const foldersToCopy = ['api', 'app', 'config', 'controllers', 'databases', 'email', 'enum', 'events', 'helpers', 'jobs', 'models', 'privileges', 'web'];

// Ensure destination directory exists
if (!fs.existsSync(destinationDir)) {
  fs.mkdirSync(destinationDir);
}

const timestamp = new Date().toISOString().replace(/[-T.]/g, '-').replace(/[:]/g, '').slice(0, -5);
const zipFileName = `archive-${timestamp}.zip`;

// Create an output stream for the zip file
const zipFilePath = path.join(destinationDir, zipFileName);
const output = fs.createWriteStream(zipFilePath);
const archive = archiver('zip', {
  zlib: { level: 9 } // Compression level (0 to 9)
});

// Pipe the output stream to the archive
archive.pipe(output);

// Iterate through the selected folders and add them to the archive
foldersToCopy.forEach(folder => {
  const sourcePath = path.join(sourceDir, folder);

  // Add the folder to the archive
  archive.directory(sourcePath, folder);
});

// Finalize the archive and close the output stream
archive.finalize();

output.on('close', () => {
  console.log(`Archive created: ${zipFilePath}`);
});

output.on('end', () => {
  console.log('Data has been drained');
});

archive.on('warning', err => {
  if (err.code === 'ENOENT') {
    console.warn(err);
  } else {
    throw err;
  }
});

archive.on('error', err => {
  throw err;
});
