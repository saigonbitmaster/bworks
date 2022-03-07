const fs = require('fs');
const util = require('util');
const path = require('path');
const exec = require('child_process').exec;
const { auto, map } = require('async');

const internalConvert = function(input, output, format, filter, callback) {
  return auto(
    {
      soffice: function(callback) {
        function paths() {
          switch (process.platform) {
            case 'darwin':
              return ['/Applications/LibreOffice.app/Contents/MacOS/soffice'];
            case 'linux':
              return ['/usr/bin/libreoffice', '/usr/bin/soffice'];
            case 'win32':
              return [path.join(process.env['PROGRAMFILES(X86)'], 'LIBREO~1/program/soffice.exe')];
          }
        }

        if (!paths(process.platform)) {
          return callback('Operating system not yet supported: ' + process.platform);
        }

        return map(
          paths(process.platform),
          function(path, callback) {
            return fs.exists(path, function(exists) {
              if (exists === true) {
                return callback(null, path);
              }

              return callback();
            });
          },
          function(err, res) {
            for (var i in res) {
              if (res[i]) {
                return callback(null, process.platform === 'win32' ? '"' + res[i] + '"' : res[i]);
              }
            }
            return callback('Could not find soffice binary');
          },
        );
      },
      convert: [
        'soffice',
        function(results, callback) {
          var command = results.soffice + ' --headless --convert-to ' + format;
          if (filter) {
            command += ':"' + filter + '"';
          }
          command += ` --outdir '${output}' '${input}'`;
          // eslint-disable-next-line no-unused-vars
          return exec(command, function(err, stdout, stderr) {
            if (err) {
              return callback(err);
            }
            let filename = `${path.parse(input).name}.${format}`;
            return callback(null, filename);
          });
        },
      ],
    },
    function(err, res) {
      if (err) {
        return callback(err);
      }

      return callback(null, res.convert);
    },
  );
};

exports.convert = async (input, output, format, filter) => {
  return util.promisify(internalConvert)(input, output, format, filter);
};
