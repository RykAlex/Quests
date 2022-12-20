<<<<<<< HEAD
const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const autoPrefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const replace = require("gulp-replace");
const ttf2woff2 = require("gulp-ttf2woff2");
const uglify = require("gulp-uglify");
const include = require("gulp-include");
const clean = require("gulp-clean");
const csso = require("gulp-csso");
const buffer = require("vinyl-buffer");
const sourcemaps = require("gulp-sourcemaps");
const GulpMem = require("gulp-mem");
// const imagemin = require("gulp-imagemin");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const flatmap = require("gulp-flatmap");
const path = require("path");
const cache = require("gulp-cached");
const argv = require("yargs").argv;
const gulpMem = new GulpMem();
gulpMem.logFn = null;
gulpMem.serveBasePath = "./build";

function browserSyncInit() {
  browserSync.init({
    server: {
      baseDir: "./build",
      middleware: argv.ram ? gulpMem.middleware : false,
    },
    port: 3000,
  });
}

function emptyStream() {
  return gulp.src("neverUsedName", {
    allowEmpty: true,
  });
}

function CSS() {
  return gulp
    .src(["./src/assets/style/*.scss", "!./src/assets/style/_*.scss"])
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        errLogToConsole: true,
        outputStyle: argv.min ? "compressed" : "expanded",
        includePaths: ["node_modules"],
      }).on("error", sass.logError)
    )
    .pipe(
      argv.ram
        ? emptyStream()
        : autoPrefixer({
            grid: true,
            cascade: true,
            overrideBrowserslist: ["last 3 versions"],
          })
    )
    .pipe(argv.min ? csso() : emptyStream())
    .pipe(argv.ram ? emptyStream() : replace("/src/", "/"))
    .pipe(sourcemaps.write("."))
    .pipe(
      argv.ram
        ? gulpMem.dest("./build/src/assets/style/")
        : gulp.dest("./build/assets/style/")
    )
    .pipe(browserSync.stream());
}

function JS() {
  return gulp
    .src(["./src/assets/script/*.js", "!./src/assets/script/_*.js"])
    .pipe(
      flatmap(function (stream, file) {
        return browserify(`./src/assets/script/${path.basename(file.path)}`, {
          debug: true,
        })
          .bundle()
          .on("error", function (err) {
            console.log(err.message);
            this.emit("end");
          })
          .pipe(source(`${path.basename(file.path)}`))
          .pipe(buffer())
          .pipe(
            sourcemaps.init({
              loadMaps: true,
            })
          )
          .pipe(argv.min ? uglify() : emptyStream())
          .pipe(sourcemaps.write("./"))
          .pipe(
            argv.ram
              ? gulpMem.dest("./build/src/assets/script/")
              : gulp.dest("./build/assets/script/")
          )
          .pipe(browserSync.stream());
      })
    );
}

function HTML() {
  return gulp.src(["./src/*.html", "!./src/_*.html"]).pipe(
    flatmap(function (stream, file) {
      return stream
        .pipe(include().on("error", console.log))
        .pipe(argv.ram ? emptyStream() : replace("/src/", "/"))
        .pipe(
          argv.separate
            ? replace("style.css", `${path.basename(file.path, ".html")}.css`)
            : emptyStream()
        )
        .pipe(
          argv.separate
            ? replace("script.js", `${path.basename(file.path, ".html")}.js`)
            : emptyStream()
        )
        .pipe(argv.ram ? gulpMem.dest("./build") : gulp.dest("./build"))
        .pipe(browserSync.stream());
    })
  );
}

function copyStatic() {
  return gulp
    .src("./src/assets/static/**/*", {
      allowEmpty: true,
    })
    .pipe(cache("static"))
    .pipe(
      argv.ram
        ? gulpMem.dest("./build/src/assets/static/")
        : gulp.dest("./build/assets/static/")
    )
    .pipe(browserSync.stream());
}

// function minimizeImgs() {
//   return gulp
//     .src("./src/assets/static/img/**/*")
//     .pipe(
//       imagemin({
//         optimizationLevel: 5,
//         verbose: true,
//       })
//     )
//     .pipe(gulp.dest("./build/assets/static/img"));
// }

function watch() {
  gulp.watch("./src/*.html", HTML);
  gulp.watch("./src/assets/script/*", JS);
  gulp.watch("./src/assets/style/**/*", CSS);
  gulp.watch("./src/assets/static/**/*", copyStatic);
}

function ttfToWoffF() {
  return gulp
    .src(["./src/assets/static/font/*.ttf"])
    .pipe(clean())
    .pipe(ttf2woff2())
    .pipe(gulp.dest("./src/assets/static/font/"));
}
exports.default = gulp.series(
  gulp.parallel(CSS, JS, HTML, copyStatic),
  argv.watch ? gulp.parallel(browserSyncInit, watch) : gulp.series(emptyStream)
);
// exports.imagemin = gulp.series(minimizeImgs);
exports.ttfToWoff = gulp.series(ttfToWoffF);
=======
import browserSync from "browser-sync"
import browserify from "browserify"
import esmify from "esmify"
import fs from "fs"
import { globby, globbySync } from "globby"
import gulp from "gulp"
import autoPrefixer from "gulp-autoprefixer"
import hb from "gulp-hb"
import imagemin, {
	gifsicle, mozjpeg, svgo
} from "gulp-imagemin"
import GulpMem from "gulp-mem"
import newer from "gulp-newer"
import rename from "gulp-rename"
import replace from "gulp-replace"
import GulpSass from "gulp-sass"
import sourcemaps from "gulp-sourcemaps"
import uglify from "gulp-uglify"
import pngquant from "imagemin-pngquant"
import path from "path"
import { env } from "process"
import Sass from "sass"
import tsify from "tsify"
import ttf2woff2 from "ttf2woff2"
import buffer from "vinyl-buffer"
import source from "vinyl-source-stream"
import yargs from "yargs"
import {
	hideBin
} from "yargs/helpers"
env.biba = "boba"
const argv = yargs(hideBin(process.argv)).argv,
	sass = GulpSass(Sass),
	gulpMem = new GulpMem()
gulpMem.logFn = null
gulpMem.serveBasePath = "./build"

function browserSyncInit() {
	browserSync.init({
		server: {
			baseDir: "./build",
			middleware: argv.ram ? gulpMem.middleware : false
		},
		port: 3000,
	})
}

function nothing() {
	return gulp.src("neverUsedName", {
		allowEmpty: true,
		read: false
	})
}

function printPaintedMessage(message, module) {
	let errs = [...message.matchAll(new RegExp(/(?:[A-Za-z]+:*\\[а-яА-Яa-zA-Z-_.\\/]+)|('[а-яА-Яa-zA-Z-_.\\/]+')/gm))]
		.map(function (curr) {
			return {
				text: curr[0],
				index: curr.index,
				length: curr[0].length
			}
		})
		.reverse()
	message = message.split("")
	errs.forEach(item => {
		message.splice(item.index, item.length, "\x1b[0m", '\x1b[35m', item.text, "\x1b[0m")
	})
	console.log(`[\x1b[31m${module}\x1b[0m] ${message.join("")}`)
}

function CSS() {
	return gulp.src(["./src/assets/style/**/*.scss", "!./src/assets/style/**/_*.scss"])
		.pipe(sourcemaps.init())
		.pipe(sass.sync({
			outputStyle: argv.min ? "compressed" : null,
			includePaths: ["node_modules"],
		})
			.on("error", function (error) {
				printPaintedMessage(error.message, "Sass")
				browserSync.notify("SASS Error")
				this.emit("end")
			}))
		.pipe(autoPrefixer({
			cascade: false,
			flexbox: false,
		}))
		.pipe(argv.ram ? nothing() : replace("/src/", "/"))
		.pipe(sourcemaps.write("."))
		.pipe(argv.ram ? gulpMem.dest("./build/src/assets/style/") : gulp.dest("./build/assets/style/"))
		.pipe(browserSync.stream())
}

function JS() {
	globbySync(["./src/assets/script/**/*.js", "!./src/assets/script/**/_*.js"]).forEach(function (file) {
		browserify(file, {
			debug: true,
			paths: ['node_modules']
		})
			.plugin(tsify)
			.plugin(esmify)
			.bundle()
			.on("error", function (error) {
				printPaintedMessage(error.message, "Browserify")
				browserSync.notify("JS Error")
				this.emit("end")
			})
			.pipe(source(`${path.basename(file)}`))
			.pipe(buffer())
			.pipe(sourcemaps.init({
				loadMaps: true
			}))
			.pipe(argv.ram ? nothing() : replace("/src/", "/"))
			.pipe(argv.min ? uglify() : nothing())
			.pipe(sourcemaps.write("./"))
			.pipe(argv.ram ? gulpMem.dest("./build/src/assets/script/") : gulp.dest("./build/assets/script/"))
			.pipe(browserSync.stream())
	})
	return nothing()
}

function HTML() {
	return gulp.src(["./src/*.html", "./src/*.hbs"])
		.pipe(
			hb()
				.partials('./src/assets/hbs/**/*.hbs').on("error", function (error) {
					printPaintedMessage(`${error.fileName} ${error.message}`, "HBS")
					browserSync.notify("HBS Error")
					this.emit("end")
				})
		)
		.pipe(argv.ram ? nothing() : replace("/src/", "/"))
		.pipe(rename(function (path) {
			path.extname = ".html"
		}))
		.pipe(argv.ram ? gulpMem.dest("./build") : gulp.dest("./build"))
		.pipe(browserSync.stream())
}

function copyStatic() {
	return gulp.src(["./src/assets/static/**/*", "!./src/assets/static/img-raw/**/*"], {
		allowEmpty: true,
		since: gulp.lastRun(copyStatic)
	})
		.pipe(argv.ram ? gulpMem.dest("./build/src/assets/static/") : gulp.dest("./build/assets/static/"))
		.pipe(browserSync.stream())
}

function makeIconsSCSS() {
	globby("./src/assets/static/img-raw/icon/**/*.svg", {}, function (er, files) {
		fs.writeFileSync("./src/assets/style/_icons.scss", "")
		fs.appendFileSync("./src/assets/style/_icons.scss", files.reduce(function (prev, curr) {
			let name = path.parse(path.relative("./src/assets/static/img-raw/icon/", curr).replaceAll('\\', '__')).name
			let css = `.icon--${name},%icon--${name}{mask-image: url(${curr.replace(".", "").replace("/img-raw/", "/img/")});}`
			return prev.concat(css)
		}, ""))
	})
	return nothing()
}

function minimizeImgs() {
	return gulp.src("./src/assets/static/img-raw/**/*", {
		allowEmpty: true
	})
		.pipe(newer("./src/assets/static/img"))
		.pipe(imagemin([
			pngquant(),
			mozjpeg(),
			svgo(),
			gifsicle()
		]))
		.pipe(gulp.dest("./src/assets/static/img/"))
}

function cleanBuild(cb) {
	if (!argv.ram) {
		fs.rmSync("./build", { recursive: true, force: true })
	}
	cb()
}

function ttfToWoff() {
	globbySync("./src/assets/static/font/**/*.ttf").forEach(function (file) {
		let relativeDir = path.relative("./src/assets/static/font/", path.dirname(file))
		let name = `${path.basename(file, path.extname(file))}.woff2`
		let destFull = path.join("./src/assets/static/font/", relativeDir, name)
		fs.writeFileSync(destFull, ttf2woff2(fs.readFileSync(file)))
		fs.unlink(file, function () { })
	})
	return nothing()
}

function cleanInitials(cb) {
	globbySync("./src/**/.placeholder").forEach(function (file) {
		fs.unlinkSync(file)
	})
	cb()
}

function watch() {
	gulp.watch(["./src/**/*.html", "./src/**/*.hbs"], HTML)
	gulp.watch(["./src/assets/script/**/*"], JS)
	gulp.watch(["./src/assets/style/**/*"], CSS)
	gulp.watch("./src/assets/static/img-raw/icon/**/*.svg", {
		events: ["add", "unlink", "unlinkDir"]
	}, makeIconsSCSS)
	gulp.watch("./src/assets/static/img-raw/**/*", minimizeImgs)
	gulp.watch(["./src/assets/static/**/*", "!./src/assets/static/img-raw/**/*"], copyStatic)
}

gulp.task("default",
	gulp.series(
		gulp.parallel(
			cleanBuild,
			makeIconsSCSS
		),
		gulp.parallel(
			CSS,
			JS,
			HTML,
			gulp.series(
				minimizeImgs,
				copyStatic
			)
		),
		argv.fwatch ?
			gulp.parallel(
				watch,
				browserSyncInit
			)
			:
			nothing
	)
)
gulp.task("imagemin", minimizeImgs)
gulp.task("ttfToWoff", ttfToWoff)
gulp.task("init", cleanInitials)
>>>>>>> 7b8c8f68095f5915cb3a9e2cb994bcc65afc8cd3
