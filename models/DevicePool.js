'use strict';

var mongoose = require('mongoose');

var DevicePool = mongoose.model('Device', {
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    occupant: String,
    status: String,
    adb_uri: String,
    spec: mongoose.Schema.Types.Mixed
});

module.exports = DevicePool;