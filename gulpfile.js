const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const hb = require('gulp-hb');
const rename = require('gulp-rename');


const browserSync = require('browser-sync').create();
const reload = browserSync.reload;


gulp.task('default', function () {
    console.log('Demo task.');
});

gulp.task('build:scss', function () {
    return gulp
        .src('./src/scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
          overrideBrowserslist: [
                "ie >= 10",
                "opera 12.1",
                "> 2%",
                "last 2 versions"
            ]
        }))
        .pipe(gulp.dest('./css'))
});

gulp.task('build:handlebars', function () {
    return gulp
        .src('./src/templates/*.handlebars')
        .pipe(hb({
            partials: './src/partials/*.handlebars'
        }))
        .pipe(rename({
            extname: ".html"
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('server-reload', function (done) {
    browserSync.reload();
    done();
});

gulp.task('watch:html', function () {
    gulp.watch('./src/**/*.handlebars', gulp.series( 'build:handlebars','server-reload'));
});

gulp.task('watch:css', function () {
    gulp.watch('./src/scss/*', gulp.series('build:scss', 'server-reload'));
});

gulp.task('watch:js', function () {
    gulp.watch('./js/*', gulp.series('server-reload'));
});


gulp.task('watch', gulp.parallel('browser-sync', 'watch:css', 'watch:html', 'watch:js'));
gulp.task('build', gulp.series('build:handlebars', 'build:scss','server-reload'));



