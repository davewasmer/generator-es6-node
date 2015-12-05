const Yeoman = require("yeoman-generator")
const slug = require("slug")
const camel = require("camelcase")

module.exports = Yeoman.generators.Base.extend({
  init: function () {
    const done = this.async()

    this.prompt([
      {
        name: "moduleName",
        message: "What is the module name?",
        filter: function (s) { return slug(s) },
        default: require("path").basename(process.cwd()).replace(/\s/g, "-")
      },
      {
        name: "moduleDesc",
        message: "What is the module description?",
        default: function (props) { return props.name }
      }
    ],
      function (props) {
        this.moduleName = props.moduleName
        this.moduleDesc = props.moduleDesc
        this.camelModuleName = camel(props.moduleName)

        this.template("README.md")
        this.template("package.json")
        this.template("LICENSE")
        this.template("CHANGELOG.md")
        this.template("index.js",       "src/index.js")
        this.template("test.js",        "test/index.js")
        this.template("test-eslintrc",  "test/.eslintrc")
        this.template("editorconfig",   ".editorconfig")
        this.template("gitignore",      ".gitignore")
        this.template("eslintrc",       ".eslintrc")
        this.template("watchmanconfig", ".watchmanconfig")
        this.template("travis.yml",     ".travis.yml")

        done()
    }.bind(this))
  },
  writing: function () {
    [
      { name: 'travis', options: { config: { after_script: ['npm run coveralls'] }}},
      { name: 'babel',  options: { 'skip-install': this.options['skip-install'] }},
      { name: 'git-init' },
    ].forEach(function(generator) {
      this.composeWith(generator.name, { options: generator.options || {} }, {
        local: require.resolve('generator-' + generator.name + '/generators/app')
      });
    }.bind(this))
  },
  install: function () { this.installDependencies({ bower: false }) }
})
