import Yeoman from 'yeoman-generator';
import slug from 'slug';
import camel from 'camelcase';

// Can't export default since yo doesn't look for that
module.exports = Yeoman.generators.Base.extend({
  init() {
    const done = this.async();

    this.prompt([
      {
        name: 'moduleName',
        message: 'What is the module name?',
        filter(s) { return slug(s); },
        default: require('path').basename(process.cwd()).replace(/\s/g, '-')
      },
      {
        name: 'moduleDesc',
        message: 'What is the module description?',
        default(props) { return props.name; }
      }
    ], (props) => {
      this.moduleName = props.moduleName;
      this.moduleDesc = props.moduleDesc;
      this.camelModuleName = camel(props.moduleName);

      this.template('README.md');
      this.template('package.json');
      this.template('LICENSE');
      this.template('CHANGELOG.md');
      this.template('index.js', 'src/index.js');
      this.template('test.js', 'test/index.js');
      this.template('test-eslintrc', 'test/.eslintrc');
      this.template('babelrc', '.babelrc');
      this.template('editorconfig', '.editorconfig');
      this.template('gitignore', '.gitignore');
      this.template('eslintrc', '.eslintrc');
      this.template('watchmanconfig', '.watchmanconfig');
      this.template('travis.yml', '.travis.yml');

      done();
    });
  },
  writing() {
    [
      { name: 'travis', options: { config: { after_script: ['npm run coveralls'] } } },
      { name: 'babel', options: { 'skip-install': this.options['skip-install'] } },
      { name: 'git-init' },
    ].forEach((generator) => {
      this.composeWith(generator.name, { options: generator.options || {} }, {
        local: require.resolve('generator-' + generator.name + '/generators/app')
      });
    });
  },
  install() {
    this.installDependencies({ bower: false });
  },
  end() {
    this.spawnCommand('node_modules/.bin/docify', ['init']);
    this.spawnCommand('git', ['add', '.']);
    this.spawnCommand('git', ['commit', '-a', '-m', 'Initial commit']);
  }
});
