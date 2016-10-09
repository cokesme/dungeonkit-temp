"use strict";

export class GameSocket {
	private listeners: Map<string, ((...args: any[]) => void)[]>;
	private socket: SocketIOClient.Socket;

	constructor() {
		this.socket = io();
		this.listeners = new Map();

		this.socket.on("init", (dungeon: CensoredDungeon) =>
			this.execute("init", dungeon));
		this.socket.on("invalid", () =>
			this.execute("invalid"));
		this.socket.on("graphics", (key: string, graphics: EntityGraphicsDescriptor) =>
			this.execute("graphics", key, graphics));
		this.socket.on("update", (message: UpdateMessage) =>
			this.execute("update", message));
	}

	emitTempSignal(hook: string, ...args: any[]): void {
		this.socket.emit(hook, ...args);
	}

	sendAction(action: Action, options?: ActionOptions) {
		this.socket.emit("action", action, options);
	}

	private execute(hook: string, ...args: any[]) {
		this.listeners.get(hook).forEach((fn) => fn(...args));
	}

	// These functions are used instead of the generic on() method to allow for better typechecking.

	onInit(fn: (dungeon: CensoredDungeon) => void): void {
		this.addListener("init", fn);
	}

	onInvalid(fn: () => void): void {
		this.addListener("invalid", fn);
	}

	onGraphics(fn: (key: string, graphics: EntityGraphicsDescriptor) => void): void {
		this.addListener("graphics", fn);
	}

	onUpdate(fn: (message: UpdateMessage) => void): void {
		this.addListener("update", fn);
	}

	private addListener(hook: string, fn: (...args: any[]) => void): void {
		if (!this.listeners.has(hook)) {
			this.listeners.set(hook, []);
		}

		this.listeners.get(hook).push(fn);
	}
}