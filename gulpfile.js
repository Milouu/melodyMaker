// JS 
const gulp = require('gulp')
const browserSync = require('browser-sync')

gulp.task('browserSync', () =>
{
  browserSync({
    server : {
      baseDir : 'app'
    }
  })
})

// Stylus
const stylus = require('gulp-stylus')

gulp.task('stylus', () =>
{
  return gulp.src('app/styles/stylus/**/*.styl')
  .pipe(stylus())
  .pipe(gulp.dest('app/styles/css'))
  .pipe(browserSync.reload({
    stream: true
  }))
})

gulp.task('watch', ['browserSync', 'stylus'], () =>
{
  gulp.watch('app/styles/stylus/**/*.styl', ['stylus'])
  gulp.watch('app/scripts/**/*.js', browserSync.reload)
  gulp.watch('app/*.html', browserSync.reload)
})

