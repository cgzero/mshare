var gulp = require('gulp');

var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var livereload = require('gulp-livereload');
var rename = require('gulp-rename');

var PATH = {
    JS: 'src/**/*.js'
};

gulp.task('js', function () {
    return gulp.src(PATH.JS)
        // 增加.min后缀
        .pipe(rename({suffix: '.min'}))
        // 压缩
        .pipe(uglify())
        // 拷贝到asset目录下
        .pipe(gulp.dest('asset'))
        // 自动刷新浏览器
        .pipe(livereload());
});

gulp.task('server', function () {
    connect.server({
        port: 8848,
        livereload: true
    });
});

gulp.task('watch', function () {
    livereload.listen();
    // 监听所有js
    gulp.watch(PATH.JS, ['js']);
    // 监听所有模板
    gulp.watch(['demo/**']).on('change', function (file) {
        livereload.changed(file.path);
    });
});

gulp.task('build', function () {
    gulp.start('js');
});


