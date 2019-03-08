// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {},
    "postcss-pxtorem": {
      replace:true,
      rootValue:75,
      propList:['font', 'font-size', 'line-height', 'letter-spacing','width','height','margin*','padding*'],
      unitPrecision:6
    }
  }
}
