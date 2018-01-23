// required
const gulp = require('gulp')
const stylus = require('gulp-stylus')
const browserSync = require('browser-sync')
const useref = require('gulp-useref')
const minifier = require('gulp-minifier')
const gulpIf = require('gulp-if')
const imagemin = require('gulp-imagemin')
const cache = require('gulp-cache')
const del = require('del')
const runSequence = require('run-sequence')

// Task to sync opened browser
gulp.task('browserSync', () => {
	browserSync({
		server: {
			baseDir: 'app'
		}
	})
})

// Task to compile stylus files in css
gulp.task('stylus', () => {
	return gulp.src('app/styles/stylus/**/*.styl')
		.pipe(stylus())
		.pipe(gulp.dest('app/styles/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
})

// Task to automatically sync browser when a changes is made on a styl, js or html file in the app directory
gulp.task('watch', ['browserSync', 'stylus'], () => {
	gulp.watch('app/styles/stylus/**/*.styl', ['stylus'])
	gulp.watch('app/scripts/**/*.js', browserSync.reload)
	gulp.watch('app/*.html', browserSync.reload)
})

// Task to concat and minify css & js files and transfer them to dist directory
gulp.task('useref', () => {
	return gulp.src('app/*.html')
		.pipe(useref())
		.pipe(gulpIf('**/*.+(js|html|css)', minifier({
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

// Task to minify images and transfer them to dist directory
gulp.task('images', () => {
	return gulp.src('app/assets/images/**/*.+(png|jpg|gif|svg)')
		.pipe(cache(imagemin({
			interlaced: true
		})))
		.pipe(gulp.dest('dist/assets/images'))
})

// Task to transfer fonts to dist directory
gulp.task('fonts', () => {
	return gulp.src('app/assets/fonts/**/*')
		.pipe(gulp.dest('dist/assets/fonts'))
})

// Task to transfer sound to dist directory
gulp.task('sounds', () => {
	return gulp.src('app/assets/sounds/**/*')
		.pipe(gulp.dest('dist/assets/sounds'))
})

// Task to clean dist directory
gulp.task('clean', (callback) =>
{
	del('dist')
	return cache.clearAll(callback) //cleaning cache to optimize all images again
})

// Task to clean dist directory expect for the images
gulp.task('clean:dist', () =>
{
	del(['dist/**/*', '!dist/assets/images', '!dist/images/**/*'])
})

// Task to run all optimization tasks at the same time to build dist repository
gulp.task('build', (callback) =>
{
	runSequence('clean:dist',
		['stylus', 'useref', 'images', 'fonts', 'sounds'],
		callback
	)
})

// Default task to build dist repository (without clean)
gulp.task('default', (callback) =>
{
	runSequence(['stylus', 'useref', 'images', 'fonts', 'sounds'],
		callback
	)
})