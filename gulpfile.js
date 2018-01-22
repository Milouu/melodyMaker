// JS 
const gulp = require('gulp')
// Stylus
const stylus = require('gulp-stylus')

gulp.task('stylus', () =>
{
  return gulp.src('app/styles/stylus/**/*.styl')
  .pipe(stylus())
  .pipe(gulp.dest('app/styles/css'))
})

gulp.task('watch', () =>
{
  gulp.watch('app/styles/stylus/**/*.styl', ['stylus'])
})
