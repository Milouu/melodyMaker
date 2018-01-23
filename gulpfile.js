// JS 
const gulp = require('gulp')
const browserSync = require('browser-sync')
const useref = require('gulp-useref')
const minifier = require('gulp-minifier')
const gulpIf = require('gulp-if')
const minifyCSS = require('gulp-minify-css')
const imagemin = require('gulp-imagemin')
var cache = require('gulp-cache')

gulp.task('browserSync', () =>
{
	browserSync({
		server : {
			baseDir : 'app'
		}
	})
})

// Concat and minify
gulp.task('minify', () => {
	return gulp.src('app/*.html')
		.pipe(useref())
		.pipe(gulpIf('*.css', minifyCSS()))
		.pipe(gulpIf('*.js', minifier({
			minify: true,
			minifyHTML: {
				collapseWhitespace: true,
				conservativeCollapse: true,
			},
			minifyJS: {
				sourceMap: true
			},
			minifyCSS: true,
			getKeptComment: (content, filePath) => {
				const m = content.match(/\/\*![\s\S]*?\*\//img)
				return m && m.join('\n') + '\n' || ''
			}
		})))
		.pipe(gulp.dest('dist'))
})

gulp.task('images', () =>
{
	return gulp.src('app/assets/images/**/*.+(png|jpg|gif|svg)')
		.pipe(cache(imagemin({
			interlaced: true
		})))
		.pipe(gulp.dest('dist/assets/images'))
})

// Stylus
var stylus = require('gulp-stylus')

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

