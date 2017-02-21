"use strict";

import {
	CanvasRenderer,
	Container,
	WebGLRenderer
} from "pixi.js";

import * as GraphicsDescriptorCache from "./graphics-descriptor-cache";
import GraphicsObject               from "./graphics-object";
import * as Tweener                 from "./tweener";

export default Layer;
export abstract class Layer<Id> extends Container {
	protected map: Map<Id, GraphicsObject>;

	constructor() {
		super();
		this.map = new Map();
	}

	protected abstract generateGraphicsObject(key: string): GraphicsObject;

	public addObject(id: Id, descriptor: string, location: Point): void {
		if (this.hasObject(id)) {
			throw new Error(`Already have object with id ${id}.`);
		}

		let obj = this.generateGraphicsObject(descriptor);

		obj.x = location.x;
		obj.y = location.y;

		this.map.set(id, obj);

		this.addChild(obj);
	}

	public hasObject(id: Id): boolean {
		return this.map.has(id);
	}

	public removeObject(id: Id): void {
		if (this.map.has(id)) {
			this.removeChild(this.map.get(id));
			this.map.delete(id);
		}
	}

	public moveObject(id: Id, target: Point, speed: number): Thenable {
		if (!this.map.has(id)) {
			throw new Error(`No object with id ${id}.`);
		}

		return Tweener.tween(this.map.get(id), target, speed);
	}

	public setObjectAnimation(id: Id, animation: string, wait: boolean): Thenable {
		if (!this.map.has(id)) {
			throw new Error(`No object with id ${id}.`);
		}

		let promise = this.map.get(id).setAnimation(animation);

		if (wait) {
			return promise;
		} else {
			return Promise.resolve();
		}
	}

	public clear(): void {
		this.map.forEach((child) => this.removeChild(child));
		this.map.clear();
	}

	protected prerender(): void { }

	public renderWebGL(renderer: WebGLRenderer): void {
		this.prerender();
		super.renderWebGL(renderer);
	}

	public renderCanvas(renderer: CanvasRenderer): void {
		this.prerender();
		super.renderCanvas(renderer);
	}
}