Wiseau
=======

Wiseau is a build tool for client-side javascript. It concatenates and minifies
your javascript, without telling you which libraries to use or how to lay out
your project.


#### Features

* Support for multiple output files
* Pluggable "engines" for various processing (TODO)
* Support for http and npm dependencies (TODO)
* JSHint integration (TODO)

Maybe later:

* Coffeescript support
* CSS build targets


#### Command Line Interface

* `wiseau init`  - Create a new project.
* `wiseau build` - Build the target files specified in your project file.
* `wiseau watch` - Watch the project's source files for changes, and re-build
                   automatically when changes are saved (TODO).

For convenience, `wiseau` is also aliased as `wi` at the command line.


#### An Example project.json File

TODO: use npm package.json "main" attribute for npm dependencies
{
    "sourceDir": "js/src",
    "outputDir": "js/build",

    "targets": {
        "libs.js": {
            dependencies: [
                "http://code.jquery.com/jquery-1.7.1.js",
                "npm:underscore@1.1.2",
                "npm:backbone@0.5.3",
            ]
        }
        "app.js": {
            dependencies: [
                "models.js",
                "views.js",
                "main.js",
            ],
            minify: false,
            lint: true
        }
    }
}


#### Prior Art

* anvil.js
* Ender
* bpm
* buildr.npm
