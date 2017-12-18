var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");

const tsConfig = require('./tsconfig.json');

gulp.task("default", function () {
    return browserify({
        basedir: '.',
        debug: true,
        cache: {},
        entries : ['./src/index.ts'],
      packageCache: {},
      standalone: 'b3'
    })
      .plugin(tsify, tsConfig.compilerOptions)
    .bundle()
    .pipe(source('behavior3.js'))
    .pipe(gulp.dest("libs"));
});