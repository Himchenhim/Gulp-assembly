 	//Подключаем модули галпа
	const gulp 			= require('gulp');
	const concat    	= require('gulp-concat');
	const autoprefixer  = require('gulp-autoprefixer');
	const cleanCSS 		= require('gulp-clean-css');
	const uglify        = require('gulp-uglify');
	const del			= require('del');
	const browserSync 	= require('browser-sync').create();
	const gulpLess 		= require('gulp-less');
	const path 			= require('path');


	//Порядок подключения css файлов
	const cssFiles = [
		'./src/css/main.css',
		'./src/css/media.css'
	]

	//Порядок подключения less файлов
	const lessFiles=[
		'./src/less/main.css',
		'./src/less/media.css'
	]
	//Порядок подключения js файлов
	const jsFiles= [
		'src/js/lib.js',
		'src/js/main.js'
	]


	//Таск на перевод less в css
	function less(){
		return gulp.src('./src/less/**/*.less')
		.pipe(gulpLess({
      		paths:[ path.join(__dirname, 'less', 'includes') ]
    	}))

		.pipe(gulp.dest('./src/css'));	


	}

	//Таск на стили CSS 
	function css() {
		//Шаблон для поиска файлов less
		//Все файлы по шаблону './src/css/**/*.css'

		return gulp.src('./src/css/**/*.css')

		//Объединение файлов в один
		.pipe(concat('styles.css'))
		
		
		//Минификация файлов
		.pipe(cleanCSS({level:2}))
		
		//Выходная папка для стилей
		.pipe(gulp.dest('./build/css'))
		.pipe(browserSync.stream())

	}

	//Tacк на скрипты js
	function scripts(){
		//Шаблон для поиска файлов JS
		//Все файлы по шаблону './src/js/**/*.js'
		return gulp.src(jsFiles)

		//Объединение файлов в один
		.pipe(concat('script.js'))

		//Минификация JS
		.pipe(uglify({
			toplevel:true
		}))

		//Выходная папка для скриптов
		.pipe(gulp.dest('build/js'))
		.pipe(browserSync.stream());

	}

	function clean() {
		return del(['build/*'])
	}

	function watch(){
		browserSync.init({
        	server: {
            	baseDir: "./"
        	}
    	});
		//Следить за CSS файлами
		gulp.watch('./src/css/**/*.css',css)
		//Следить за JS файлами
		gulp.watch('./src/jss/**/*.js',scripts)
		//При изменении HTML запустить синхронизацию
		gulp.watch("./*.html").on('change',browserSync.reload);
	}

	//Таск вызывающий функцию styles
	gulp.task('styles', gulp.series(less,css));
	//Таск вызывающий функцию scripts
	gulp.task('scripts', scripts);
	//Таск удаления внутри корневого файла
	gulp.task('del', clean);
	//Таск для отслеживания изменений 
	gulp.task('watch',watch);
	//Таск для удалния файлов в папке build и запуск styles и scripts
	gulp.task('build', gulp.series(clean, gulp.parallel(less,css, scripts)))
	//Таск запускает таск build и watch последовательно
	gulp.task('dev',gulp.series('build','watch'));



