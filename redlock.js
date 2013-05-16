// ---------------------------------------------------------------------------------------
//
// redlock.js - Distributed locking mechanism with lock names, retries, timeouts and keep-alive.
//
// Copyright (c) 2013 Andrew Chilton <andychilton@gmail.com> - http://chilts.org/blog/
//
// License: MIT - http://chilts.mit-license.org/2013/
//
// ---------------------------------------------------------------------------------------

// http://redis.io/commands/setnx

// ---------------------------------------------------------------------------------------

var defaults = {
    prefix  : '',
    timeout : 60,
    retries : undefined,
};

var nop = function(){};

// ---------------------------------------------------------------------------------------

function redlock(opts) {
    Object.keys(defaults).forEach(function(key) {
        opts[key] = opts[key] || defaults[key];
    });

    if ( !opts.client ) {
        throw new Error("You must provide a Redis client to redlock");
    }

    return function(name, timeout, callback) {
        if ( callback === undefined ) {
            callback = timeout;
            timeout = opts.timeout;
        }
        if ( callback === undefined ) {
            callback = nop;
        }

        // create the key
        var key = opts.prefix + name;

        var lock = {
            release : function(callback) {
                callback ||= nop;
                opts.client.del(key, callback);
            },
            ping : function(callback) {
                callback ||= nop;
                opts.client.setx(key, 1, opts.timeout, callback);
            },
        };

        client.setnx(key, 1, opts.timeout, function(err, value) {
            if ( err ) return callback(err);

            if ( value ) {
                // yes, we set the key ok
                callback(null, lock);
            }
            else {
                callback();
            }
        });
    };
};

// ---------------------------------------------------------------------------------------

module.exports = redlock;

// ---------------------------------------------------------------------------------------
