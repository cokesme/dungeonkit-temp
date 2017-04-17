"use strict";

import * as cluster     from "cluster";
import * as express     from "express";
import * as http        from "http";
import * as kue         from "kue";
import * as nconf       from "nconf";
import * as net         from "net";
import * as path        from "path";
import * as redis       from "redis";
import * as socketio    from "socket.io";
import * as sourcemap   from "source-map-support";

nconf.argv().env();

const numCommNodes = nconf.get("comm") || 1;
const numLogicNodes = nconf.get("logic") || 1;

let workers: cluster.Worker[] = [];

let queue = kue.createQueue();

sourcemap.install();

if (cluster.isMaster) {
	const log  = require("beautiful-log")("dungeonkit:base", { color: "red", showDelta: false });
	const redisClient = redis.createClient();

	redisClient.del("dk:logic");

	log("Starting master");
	const PORT: number = nconf.get("port") || 6918;

	for (let i = 0; i < numCommNodes; i++) {
		spawnCommNode(log, i);
	}

	for (let i = 0; i < numLogicNodes; i++) {
		spawnLogicNode(log, i + numCommNodes);
	}

	net.createServer({ pauseOnConnect: true } as {}, (connection: net.Socket) => {
		let worker = workers[0]; // TODO
		worker.send("sticky-session:connection", connection);
	}).listen(PORT);

	// Create monitor app
	const app: express.Express = express();
	app.use("/", express.static(path.join(__dirname, "../monitor")));

	const MONITOR_PORT = nconf.get("monitor-port") || 3000;
	const server: http.Server = app.listen(MONITOR_PORT, "localhost", () => {
		log("Monitor server is up");
	});

	const io: SocketIO.Server = socketio(server);

	setInterval(() => {
		log("Sending monitor update");

		let commStatsPrm = getCommStats(redisClient);
		let logicStatsPrm = getLogicStats(redisClient);
		let queueStatsPrm = getQueueStats();

		Promise.all([commStatsPrm, logicStatsPrm, queueStatsPrm])
			.then(([commNodes, logicNodes, queues]) => {
				let stats: MonitorStats = { commNodes, logicNodes, queues };
				log(stats);
				io.emit("update", stats);
			});
	}, 5000);
} else {
	if (process.env["designation"] === "comm") {
		require("./comm-layer/server").start(queue);
	} else {
		require("./logic-layer/server").start(queue);
	}
}

function spawnCommNode(log: (...args: any[]) => void, idx: number): void {
	log("Spawning comm worker", idx);
	let env = Object.assign({}, process.env, { designation: "comm" });
	workers[idx] = cluster.fork(env);

	workers[idx].on("exit", (code, signal) => {
		spawnCommNode(log, idx);
	});
}

function spawnLogicNode(log: (...args: any[]) => void, idx: number): void {
	log("Spawning logic worker", idx);
	let env = Object.assign({}, process.env, { designation: "logic" });
	workers[idx] = cluster.fork(env);

	workers[idx].on("exit", (code, signal) => {
		spawnLogicNode(log, idx);
	});
}

function getCommStats(redisClient: redis.RedisClient): Promise<CommNodeStats[]> {
	return new Promise((resolve, reject) => {
		resolve([{ name: "Blinker" }]);
	});
}

function getLogicStats(redisClient: redis.RedisClient): Promise<LogicNodeStats[]> {
	return new Promise((resolve, reject) => {
		redisClient.zrange(`dk:logic`, 0, -1, "withscores", (err: Error, stats: string[]) => {
			let ret: LogicNodeStats[] = [];

			for (let i = 0; i < stats.length; i += 2) {
				ret.push({ name: stats[i], games: parseInt(stats[i + 1]) });
			}

			resolve(ret);
		});
	});
}

function getQueueStats(): Promise<QueueStats[]> {
	return new Promise((resolve, reject) => {
		queue.types((err: Error, types: string[]) => {
			resolve(Promise.all(types.map((type) =>
				new Promise((res, rej) => queue.activeCount(type, (err: Error, count: number) => res({ name: type, length: count }))))));
		});
	});
}