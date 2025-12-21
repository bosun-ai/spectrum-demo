const { spawn } = require('child_process');
const child = spawn('nvm', ['use', '12', '&&', 'node', '-v'], {
  shell: true,
  stdio: 'inherit',
});
child.on('exit', code => process.exit(code));
