Wiseau
=======

Wiseau is a build tool for client-side javascript. It concatenates and minifies
your javascript, without telling you which libraries to use or how to lay out
your project.


#### Features

* Support for multiple output files
* Minification via uglify-js
* (TODO) Support for http and npm dependencies
* (TODO) JSHint integration

Maybe later:

* Coffeescript support
* CSS/Stylus build targets


#### Command Line Interface

* `wiseau init`  - Start a new project by creating a new clientbuild.json config file.
* `wiseau build` - Build the target files specified in your config file.
* `wiseau watch` - (TODO) Watch the project's source files for changes, and re-build
                   automatically when changes are saved.

For convenience, `wiseau` is also aliased as `wi` at the command line.


#### An Example clientbuild.json File

```
// Single-line comments can be added to your json config file.
{
    "sourceDir": "js/src",                  // The relative path to your source code
    "outputDir": "js/build",                // Where to place the output of the build

    "targets": {
        "libs.js": {
            "sourceDir": "js/src/libs",     // You can override config values per target
            "dependencies": [
                "jquery.js",
                "underscore.js",
                "backbone.js"
            ]
        },
        "app.js": {                         // You can create as many build targets as you like
            "minify": false,                // Minification is optional (but enabled by default)
            "dependencies": [
                "models.js",
                "views.js",
                "main.js"
            ]
        }
    }
}
```


#### Alternatives/Prior Art

* anvil.js
* Ender
* bpm
* buildr.npm
