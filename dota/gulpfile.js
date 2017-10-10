let gulp         = require('gulp');
let sass         = require('gulp-sass');
let autoprefixer = require('gulp-autoprefixer');
let concat       = require('gulp-concat');

let browserSync  = require('browser-sync').create();
let reload       = browserSync.reload;



// Таск по умолчанию
gulp.task('default', function () {
    console.log('Demo task.');
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
    gulp.watch('./*.{html}', gulp.series( 'server-reload'));
});

gulp.task('watch:css', function () {
    gulp.watch('./scss/*', gulp.series('build:scss', 'server-reload'));
});

gulp.task('watch', gulp.parallel('browser-sync', 'watch:css', 'watch:html'));



