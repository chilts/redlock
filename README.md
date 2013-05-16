# RedLock #

Distributed locking mechanism with lock names, retries, timeouts and keep-alive.

## Example ##

```javascript
var redlock = require('redlock');

var getLock = redlock({
    client  : redisClient,
    prefix  : 'lock:',
    timeout : 120,

});

getLock('mylock', function(err, lock) {
    // if there's been a bad error, get out of here
    if (err) throw err;

    // if we didn't get the lock, just return
    if ( !lock ) return;

    doSomethingInvolvingAsyn(function(err) {
        // we've now finished with the lock
        lock.release();
    });
});
```

## Options to 'redlock' ##

* client
* prefix (default: '')
* timeout (default: 60)

## Options to 'getLock' ##

* name (required)
* timeout (optional)
* callback (required)

If you provide a timeout, it will be


# Author #

Written by [Andrew Chilton](http://chilts.org/) - [Blog](http://chilts.org/blog/) -
[Twitter](https://twitter.com/andychilton).

# License #

* [Copyright 2013 Andrew Chilton.  All rights reserved.](http://chilts.mit-license.org/2013/)

(Ends)
