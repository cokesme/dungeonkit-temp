// Entrypoint for spawning a standalone logic node.

"use strict";

import * as nconf       from "nconf";
import * as kue         from "kue";
import * as sourcemap   from "source-map-support";

nconf.argv().env();
sourcemap.install();

let queue = kue.createQueue({
	redis: {
		host: nconf.get("redis-host") || "127.0.0.1",
		port: nconf.get("redis-port") || 6379
	}
});

require("./server").start(queue);