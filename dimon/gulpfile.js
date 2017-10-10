var gulp         = require('gulp');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat       = require('gulp-concat');
var hb           = require('gulp-hb');
var rename       = require('gulp-rename');

var browserSync  = require('browser-sync').create();
var reload       = browserSync.reload;



// Таск по умолчанию
gulp.task('default', function () {
    console.log('Demo task.');
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



gulp.task('build:scss', function () {
    return gulp.src('./scss/layout.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browserslist: [
                "ie >= 10",
                "opera 12.1",
                "> 2%",
                "last 2 versions"
            ]
        }))
        .pipe(gulp.dest('./css'))
});



// Static server
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
    gulp.watch('./src/**/*', gulp.series( 'build:handlebars','server-reload'));
});

gulp.task('watch:js', function () {
    gulp.watch('./js/*', gulp.series( 'server-reload'));
});

gulp.task('watch:css', function () {
    gulp.watch('./scss/*', gulp.series('build:scss', 'server-reload'));
});

gulp.task('watch', gulp.parallel('browser-sync', 'watch:css', 'watch:html', 'watch:js'));



