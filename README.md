# misc-helpers
Misc helpers like break/build bitmask, print to console etc, get system date etc...

# Info
To avoid require path like this `"./../../../"`
One may want to define `__BASE` global: `global.__BASE = path.normalize(__dirname + '/');`
And then to include in in file: `var helpers = require(__BASE + '/helpers');`