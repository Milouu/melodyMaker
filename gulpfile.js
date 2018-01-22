// JS 
var gulp = require('gulp')
var browserSync = require('browser-sync')
var useref = require('gulp-useref')
var uglify = require('gulp-uglify')

gulp.task('browserSync', function ()
{
  browserSync({
    server : {
      baseDir : 'app'
    }
  })
})

gulp.task('useref', function ()
{ 
  return gulp.src('app/*.html')
//    .pipe(uglify())
    .pipe(useref())
    .pipe(gulp.dest('dist'))
})

// Stylus
var stylus = require('gulp-stylus')

gulp.task('stylus', function ()
{
  return gulp.src('app/styles/stylus/**/*.styl')
  .pipe(stylus())
  .pipe(gulp.dest('app/styles/css'))
  .pipe(browserSync.reload({
    stream: true
  }))
})

gulp.task('watch', ['browserSync', 'stylus'], function ()
{
  gulp.watch('app/styles/stylus/**/*.styl', ['stylus'])
  gulp.watch('app/scripts/**/*.js', browserSync.reload)
  gulp.watch('app/*.html', browserSync.reload)
})

