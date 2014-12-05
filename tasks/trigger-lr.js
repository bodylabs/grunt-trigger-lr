// Copyright (c) 2014, Body Labs, Inc.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//
// 1. Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright
// notice, this list of conditions and the following disclaimer in the
// documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
// FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
// COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
// INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS
// OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
// AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
// LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY
// WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

(function () {
    'use strict';

    var LRNotifier = require('../lr-notifier'),
        _ = require('underscore');

    module.exports = function (grunt) {

        // Adapted from
        // https://github.com/gruntjs/grunt-contrib-watch#compiling-files-as-needed
        var watchedFiles = new Array();

        var clearWatchedFiles = grunt.util._.debounce(function() {
            watchedFiles = new Array();
        }, 1000);

        var listener = function (action, filepath) {
            watchedFiles.push(filepath);
            // This is to fix a problem with multiple events arriving after
            // using the `reload: true' option in grunt-contrib-watch.
            grunt.event.once('watch', listener);
            clearWatchedFiles();
        };

        grunt.event.once('watch', listener);

        grunt.config.merge({
            trigger_lr: {
                everything: {
                    options: {
                        everything: true,
                    },
                },
                watched: {
                    options: {
                        watched: true,
                    },
                },
            },
        });

        grunt.registerMultiTask('trigger_lr', 'Trigger LiveReload', function () {

            var options = this.options(),
                done = this.async();

            var files = [];

            if (options.everything) {
                files = null;
            } else if (options.watched === true) {
                files = watchedFiles;
            } else if (_(options.paths).isArray()) {
                files = options.paths;
            }

            if (_(files).isArray() && files.length === 0) {
                grunt.log.writeln('Nothing changed');
                done();
                return;
            }

            var notifier = new LRNotifier(options);

            notifier.trigger(files, function (err) {

                if (err) {
                    grunt.log.writeln(err.message);
                    grunt.log.writeln(err.detail);
                } else {
                    if (files === null) {
                        grunt.log.writeln('Triggered live reload');
                    } else {
                        grunt.log.writeln('Triggered live reload for: ' + files);
                    }
                }

                done();
            });
        });
    };

})();
