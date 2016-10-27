"use strict";

import GraphicsObject from "./graphics-object";
import * as Tweener   from "./tweener";

export default GraphicsManager;
export abstract class GraphicsManager<Id, Descriptor> {
	protected map: Map<Id, GraphicsObject>;
	protected container: PIXI.Container;

	protected abstract generateGraphicsObject(descriptor: Descriptor): GraphicsObject;

	constructor(container: PIXI.Container) {
		this.map = new Map();
		this.container = container;
	}

	public addObject(id: Id, descriptor: Descriptor, location: Point): void {
		if (this.hasObject(id)) {
			throw new Error(`Already have object with id ${id}.`);
		}

		let obj = this.generateGraphicsObject(descriptor);

		obj.x = location.x;
		obj.y = location.y;

		this.map.set(id, obj);

		this.container.addChild(obj);
	}

	public hasObject(id: Id): boolean {
		return this.map.has(id);
	}

	public removeObject(id: Id): void {
		if (this.map.has(id)) {
			this.container.removeChild(this.map.get(id));
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
		this.map.forEach((child) => this.container.removeChild(child));
		this.map.clear();
	}
}