grunt-trigger-lr
================

[Grunt][] plugin for triggering [LiveReload][] using a task.


What does this provide?
-----------------------

This complements the functionality of [grunt-contrib-watch][]
and [tiny-lr][].

For example:

1. You can start your own livereload server, and still trigger
   it from a watch task. This is useful if you want to use
   grunt-contrib-watch's `reload: true` option. By starting
   the livereload server outside of grunt, it can persist
   even if grunt reloads itself.

2. You can carefully control the timing of the livereload
   trigger. For example, if you are recompiling the entire
   site, you can trigger livereload one time after you are
   finished. (To do this with grunt-contrib-watch, you must
   watch the generated files.)


Installation
------------

Install grunt-trigger-lr by running:

    npm install grunt-trigger-lr


Example
-------

    grunt.config.extend({

        trigger_lr: {
            options: {
                port: 37001,
            },
        },

        watch: {
            base_templates: {
                files: 'index.html',
                tasks: [
                    'assemble',
                    'trigger_lr:everything',
                ],
            },
        },
    });

    grunt.loadNpmTasks('grunt-trigger-lr');


Built-in targets
----------------

#### trigger_lr:everything

Reload everything. Equivalent to:

    { options: { everything: true } }

#### trigger_lr:watched

Reload watched paths. Equivalent to:

    { options: { watched: true } }


Options
-------

#### host

The hostname or IP address of the livereload server. (String. Default: localhost)

#### port

The port running the livereload server. (Number. Default: 35729)

#### scheme

The scheme ('http' or 'https') for the livereload server. (String. Default: http)

#### everything

If true, reloads everything. (Default: false)

#### watched

If true, reload the paths which have received a watch event. (Default: false)

#### paths

If specified, reload the specified paths. (Default: undefined)


Contribute
----------

- Issue Tracker: github.com/bodylabs/grunt-trigger-lr/issues
- Source Code: github.com/bodylabs/grunt-trigger-lr


License
-------

The project is licensed under the two-clause BSD license.


[Grunt]: http://gruntjs.com/
[LiveReload]: http://livereload.com/
[grunt-contrib-watch]: https://github.com/gruntjs/grunt-contrib-watch
[tiny-lr]: https://github.com/mklabs/tiny-lr
