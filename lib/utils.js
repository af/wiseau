var path = require('path');
var fs = require('fs');

/*
 * Creates directories recursively, like "mkdir -p" in the shell.
 * Copied (and only slightly modified) from:
 * https://github.com/substack/node-mkdirp/blob/master/index.js
 *
 * LICENSE:
 *  Copyright 2010 James Halliday (mail@substack.net)
 *  This project is free software released under the MIT/X11 license:

 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:

 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.

 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
function mkdir_recursive(p, mode, callback) {
    var cb = callback || function () {};
    mode = mode || '0777';
    if (typeof mode === 'string') mode = parseInt(mode, 8);
    p = path.resolve(p);

    fs.mkdir(p, mode, function (er) {
        if (!er) return cb();
        switch (er.code) {
            case 'ENOENT':
                mkdir_recursive(path.dirname(p), mode, function (er) {
                    if (er) cb(er);
                    else mkdir_recursive(p, mode, cb);
                });
                break;

            case 'EEXIST':
                fs.stat(p, function (er2, stat) {
                    // if the stat fails, then that's super weird.
                    // let the original EEXIST be the failure reason.
                    if (er2 || !stat.isDirectory()) cb(er)
                    else if ((stat.mode & 0777) !== mode) fs.chmod(p, mode, cb);
                    else cb();
                });
                break;

            default:
                cb(er);
                break;
        }
    });
}

exports.mkdir_recursive = mkdir_recursive;
