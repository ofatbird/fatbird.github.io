const spawn = require('cross-spawn')

// spawn.sync('git', ['pull'])
spawn.sync('git', ['add', '.'])
spawn.sync('git', ['commit', '-a', '-m', 'update blogs'])
spawn.sync('git', ['push'])
// console.log(result)