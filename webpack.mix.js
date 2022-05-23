const mix = require("laravel-mix");
const path = require("path");
const fs = require("fs");
const Clean = require("clean-webpack-plugin");
const Obfuscator = require("webpack-obfuscator");
const ejs = require("ejs-html");
const pretty = require("pretty");

const publicPath = "public";
let plugins = [new Clean([publicPath], { allowExternal: true })];

const vueFilename = "app.js";
const jsFilename = "assets.js";
const cssFilename = "assets.css";

if (process.env.ENV == "production")
  plugins.push(
    new Obfuscator(
      {
        compact: true,
        controlFlowFlattening: false,
        deadCodeInjection: false,
        debugProtection: false,
        debugProtectionInterval: false,
        disableConsoleOutput: true,
        identifierNamesGenerator: "hexadecimal",
        log: false,
        renameGlobals: false,
        rotateStringArray: true,
        selfDefending: true,
        shuffleStringArray: true,
        splitStrings: false,
        stringArray: true,
        stringArrayEncoding: false,
        stringArrayThreshold: 0.75,
        unicodeEscapeSequence: false,
      },
      [jsFilename]
    )
  );

mix.setPublicPath(publicPath);

mix.webpackConfig({
  plugins,
});

mix.scripts(
  [
    "assets/vendor/jquery/dist/jquery.min.js",
    "assets/vendor/js-cookie/js.cookie.js",
    "assets/vendor/bootstrap/dist/js/bootstrap.bundle.min.js",
    "assets/vendor/jquery.scrollbar/jquery.scrollbar.min.js",
    "assets/vendor/jquery-scroll-lock/dist/jquery-scrollLock.min.js",
    "assets/vendor/lavalamp/js/jquery.lavalamp.min.js",
    "assets/js/jquery-confirm.min.js",
    "assets/js/bootstrap-select.js",
    "assets/js/jquery.validate.js",
    "assets/js/additional-methods.js",
    "assets/js/datepicker.min.js",
    "assets/js/datepicker.en.js",
    "assets/js/jquery.mask.min.js",
    "assets/js/argon.js",
  ],
  `${publicPath}/js/${jsFilename}`
);

mix.styles(
  [
    "assets/css/open-sans.css",
    "assets/css/merriweather-sans.css",
    "assets/vendor/nucleo/css/nucleo.css",
    "assets/vendor/@fortawesome/fontawesome-free/css/all.min.css",
    "assets/css/jquery-confirm.min.css",
    "assets/css/bootstrap-select.css",
    "assets/css/datepicker.min.css",
    "assets/css/argon.min.css",
  ],
  `${publicPath}/js/${cssFilename}`
);

mix.copyDirectory("assets/img", `${publicPath}/img`);
mix.copyDirectory("assets/fonts", `${publicPath}/fonts`);
mix.copyDirectory("assets/fonts/nucleo", `${publicPath}/fonts`);
mix.copyDirectory(
  "assets/vendor/@fortawesome/fontawesome-free/webfonts",
  `${publicPath}/webfonts`
);

mix.js("vuesrc/app.js", `${publicPath}/js/${vueFilename}`).extract(["vue"]);

mix.version();

mix.then(() => {
  try {
    const manifest_path = path.join(
      __dirname,
      `${publicPath}/mix-manifest.json`
    );
    const ejs_path = path.join(__dirname, "/template/index.ejs");
    const output_path = path.join(__dirname, `${publicPath}/index.html`);
    const manifest = require(manifest_path);
    const html = fs.readFileSync(ejs_path, "utf-8");

    let manifest_data_js = [jsFilename];
    let manifest_data_css = [cssFilename];
    let vendors = ["manifest.js", "vendor.js", vueFilename];

    for (var key in manifest) {
      const key_name = key.split("/").pop();

      if (/\.js/i.test(manifest[key])) {
        if (vendors.includes(key_name))
          vendors[vendors.indexOf(key_name)] = manifest[key].substring(1);
        else
          manifest_data_js[manifest_data_js.indexOf(key_name)] = manifest[
            key
          ].substring(1);
      } else
        manifest_data_css[manifest_data_css.indexOf(key_name)] = manifest[
          key
        ].substring(1);
    }

    manifest_data_js = [...manifest_data_js, ...vendors];

    let output = ejs.render(
      html,
      {
        icon: process.env.ICON,
        js_files: manifest_data_js,
        css_files: manifest_data_css,
        baseUrl: process.env.BASE_URL,
      },
      {
        vars: ["js_files", "icon", "css_files", "baseUrl"],
      }
    );

    output = pretty(output);

    fs.writeFileSync(output_path, output);
  } catch (e) {
    console.log(e);
  }
});
