const pkg = require('../package.json');
const { program } = require('commander');
const {
  DEFAULT_REGISTRY,
  DEFAULT_IS_BETA
} = require('../dist/index.cjs')

const run = require('../dist/index.cjs').default

program
  .name(pkg.name)
  .version(pkg.version)

program.command('run')
  .option('-r, --registry <registry>', 'npm registry', DEFAULT_REGISTRY)
  .option('-b, --beta', 'is beta version', DEFAULT_IS_BETA)
  .action((config) => {
    run(config).then(() => {
      process.exit(0);
    })
  })

program.parse();