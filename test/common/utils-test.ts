"use strict";

import * as data  from "../test-data.ts";
import * as test  from "../test-utils.ts";
import * as utils from "../../src/common/utils";

console.log("hi");

export function testUtils(): void {
	describe("utils", () => {
		describe("decodeDirection()", () => {
			it("should decode 0 properly", () =>
				test.eq(utils.decodeDirection(0), [0, 1]));
			it("should decode 1 properly", () =>
				test.eq(utils.decodeDirection(1), [-1, 1]));
			it("should decode 2 properly", () =>
				test.eq(utils.decodeDirection(2), [-1, 0]));
			it("should decode 3 properly", () =>
				test.eq(utils.decodeDirection(3), [-1, -1]));
			it("should decode 4 properly", () =>
				test.eq(utils.decodeDirection(4), [0, -1]));
			it("should decode 5 properly", () =>
				test.eq(utils.decodeDirection(5), [1, -1]));
			it("should decode 6 properly", () =>
				test.eq(utils.decodeDirection(6), [1, 0]));
			it("should decode 7 properly", () =>
				test.eq(utils.decodeDirection(7), [1, 1]));
			it("should mod positive numbers properly", () =>
				test.eq(utils.decodeDirection(15), [1, 1]));
			it("should mod negative numbers properly", () =>
				test.eq(utils.decodeDirection(-3), [1, -1]));
			it("should error on floats", () =>
				test.error(() => utils.decodeDirection(3.14)));
		});

		describe("areLocationsEqual()", () => {
			it("should accept equal valid locations", () =>
				test.eq(utils.areLocationsEqual({ r: 3, c: 8 }, { r: 3, c: 8 }), true));
			it("should accept equal invalid locations", () =>
				test.eq(utils.areLocationsEqual({ r: -6, c: 2.2 }, { r: -6, c: 2.2 }), true));
			it("should reject unequal valid locations", () =>
				test.eq(utils.areLocationsEqual({ r: 3, c: 8 }, { r: 1, c: 2 }), false));
			it("should reject unequal invalid locations", () =>
				test.eq(utils.areLocationsEqual({ r: 3.14, c: -5 }, { r: -4, c: 2.17 }), false));
		});

		describe("getEntityAtLocation()", () => {
			it("should return the entity at the location if there is one", () =>
				test.eq(utils.getEntityAtLocation(data.testInProgressState, { r: 3, c: 6 }), data.testEntity1));
			it("should return the entity at the location if there is one", () =>
				test.eq(utils.getEntityAtLocation(data.testInProgressState, { r: 15, c: 3 }), data.testEntity2));
			it("should return the entity at the location if there is one", () =>
				test.eq(utils.getEntityAtLocation(data.testInProgressState, { r: 13, c: 15 }), data.testEntity3));
			it("should return undefined if there is no entity at the location", () =>
				test.eq(utils.getEntityAtLocation(data.testInProgressState, { r: 0, c: 0 }), undefined));
			it("should return undefined if there is no entity at the location", () =>
				test.eq(utils.getEntityAtLocation(data.testInProgressState, { r: 12, c: 2 }), undefined));
			it("should return undefined if the location is invalid", () =>
				test.eq(utils.getEntityAtLocation(data.testInProgressState, { r: 1.2, c: -1 }), undefined));
		});

		describe("getItemAtLocation()", () => {
			it("should return the item at the location if there is one", () =>
				test.eq(utils.getItemAtLocation(data.testInProgressState, { r: 12, c: 16 }), data.testItem4));
			it("should return the item at the location if there is one", () =>
				test.eq(utils.getItemAtLocation(data.testInProgressState, { r: 2, c: 6 }), data.testItem3));
			it("should return undefined if there is no item at the given location", () =>
				test.eq(utils.getItemAtLocation(data.testInProgressState, { r: 4, c: 12 }), undefined));
			it("should return undefined if there is no item at the given location", () =>
				test.eq(utils.getItemAtLocation(data.testInProgressState, { r: 8, c: 8 }), undefined));
			it("should return undefined if the location is invalid", () =>
				test.eq(utils.getItemAtLocation(data.testInProgressState, { r: 0.5, c: -12 }), undefined));
		});

		describe("isLocationEmpty()", () => {
			it("should return false if there is an entity in the location", () =>
				test.eq(utils.isLocationEmpty(data.testInProgressState, { r: 3, c: 6 }), false));
			it("should return false if there is an entity in the location", () =>
				test.eq(utils.isLocationEmpty(data.testInProgressState, { r: 15, c: 3 }), false));
			it("should return false if there is an entity in the location", () =>
				test.eq(utils.isLocationEmpty(data.testInProgressState, { r: 13, c: 15 }), false));
			it("should return true if there is no entity at the location", () =>
				test.eq(utils.isLocationEmpty(data.testInProgressState, { r: 0, c: 0 }), true));
			it("should return true if there is no entity at the location", () =>
				test.eq(utils.isLocationEmpty(data.testInProgressState, { r: 12, c: 2 }), true));
			it("should return true if there is no entity at the location", () =>
				test.eq(utils.isLocationEmpty(data.testInProgressState, { r: 1.2, c: -1 }), true));
		});

		describe("isLocationInMap()", () => {
			it("should accept in-bounds locations", () =>
				test.eq(utils.isLocationInMap(data.testMap, { r: 4, c: 12 }), true));
			it("should reject locations with a row that is too high", () =>
				test.eq(utils.isLocationInMap(data.testMap, { r: 20, c: 8 }), false));
			it("should reject locations with a column that is too high", () =>
				test.eq(utils.isLocationInMap(data.testMap, { r: 4, c: 22 }), false));
			it("should reject locations with a row that is too low", () =>
				test.eq(utils.isLocationInMap(data.testMap, { r: -2, c: 4 }), false));
			it("should reject locations with a column that is too low", () =>
				test.eq(utils.isLocationInMap(data.testMap, { r: 0, c: -1 }), false));
		});

		describe("isCrawlOver()", () => {
			it("should accept concluded failed crawls", () =>
				test.eq(utils.isCrawlOver(data.testConcludedFailureState), true));
			it("should accept concluded successful crawls", () =>
				test.eq(utils.isCrawlOver(data.testConcludedSuccessState), true));
			it("should reject in-progress crawl states", () =>
				test.eq(utils.isCrawlOver(data.testInProgressState), false));
		});

		describe("bound()", () => {
			it("should not affect valuees that fall within the range", () =>
				test.eq(utils.bound(4.6, 2, 20), 4.6));
			it("should increase values that fall below the range", () =>
				test.eq(utils.bound(1, 5, 10), 5));
			it("should decrease values that fall above the range", () =>
				test.eq(utils.bound(20, -19, -4), -4));
			it("should allow a zero-size range", () =>
				test.eq(utils.bound(2, 6, 6), 6));
			it("should not allow an invalid range", () =>
				test.error(() => utils.bound(5, 19, 2)));
		});

		describe("randint()", () => {
			it("should return integer values in the given range", () => {
				let min = Infinity;
				let max = -Infinity;

				for (let i = 0; i < 10000; i++) {
					let x = utils.randint(4, 8);

					if (!Number.isInteger(x)) {
						throw new Error(sprintf("Expected an integer but received %f", x));
					}

					if (x < 4 || x > 8) {
						throw new Error(sprintf("Expected a value between 4 and 8 inclusive but received %d", x));
					}

					min = Math.min(min, x);
					max = Math.max(max, x);
				}

				if (min !== 4 || max !== 8) {
					throw new Error(
						sprintf("Expected values in the range [4, 8] but received values in the range [%d, %d]"
							+ " (Note that this has a MINISCULE (< 1e-100) chance of failure.)",
							min,
							max));
				}
			});

			it("should not allow an invalid range", () =>
				test.error(() => utils.randint(5, 4)));
		});

		describe("distance()", () => {
			it("should return 0 for equal locations", () =>
				test.eq(utils.distance({ r: 3, c: 4 }, { r: 3, c: 4 }), 0));
			it("should return 1 for edgewise adjacent locations", () =>
				test.eq(utils.distance({ r: 2, c: 2 }, { r: 1, c: 2 }), 1));
			it("should return 1 for diagonally adjacent locations", () =>
				test.eq(utils.distance({ r: 0, c: 1 }, { r: 1, c: 0 }), 1));
			it("should work for larger distances", () =>
				test.eq(utils.distance({ r: 15122, c: 15150 }, { r: 79345, c: 80180 }), 65030));
			it("should work for invalid locations", () =>
				test.eq(utils.distance({ r: -1, c: 2.3 }, { r: 3.2, c: -9 }), 11.3));
		});

		// Tests for printMap omitted

		// Tests for printState omitted

		describe("tabulate()", () => {
			it("should work for length-0 lists", () => test.eq(utils.tabulate((i) => 0, 0), []));
			it("should work for length-1 lists", () => test.eq(utils.tabulate((i) => 4, 1), [4]));

			it("should work for longer lists", () => {
				let x = utils.tabulate((i) => Math.sin(i) + Math.cos(i), 1000);

				let ans: number[] = [];

				for (let i = 0; i < 1000; i++) {
					ans.push(Math.sin(i) + Math.cos(i));
				}

				test.eq(x, ans);
			});

			it("should round down the given length", () =>
				test.eq(utils.tabulate((i) => i * i, 3.14), [0, 1, 4]));
			it("should return an empty list if the given length is negative", () =>
				test.eq(utils.tabulate((i) => 2, -1), []));
			it("should work for non-numerical types", () =>
				test.eq(utils.tabulate((i) => "sub".substring(i), 4), ["sub", "ub", "b", ""]));
		});

		describe("isLocationInRoom()", () => {
			it("should accept a location that is in a room", () =>
				test.eq(utils.isLocationInRoom(data.testMap, { r: 2, c: 6 }), true));
			it("should accept a location that is in a room", () =>
				test.eq(utils.isLocationInRoom(data.testMap, { r: 3, c: 9 }), true));
			it("should accept a location that is in a room", () =>
				test.eq(utils.isLocationInRoom(data.testMap, { r: 15, c: 6 }), true));
			it("should accept a location that is in a room", () =>
				test.eq(utils.isLocationInRoom(data.testMap, { r: 15, c: 17 }), true));
			it("should reject locations that are not in rooms", () =>
				test.eq(utils.isLocationInRoom(data.testMap, { r: 10, c: 2 }), false));
			it("should reject locations that are not in rooms", () =>
				test.eq(utils.isLocationInRoom(data.testMap, { r: 0, c: 0 }), false));
			it("should reject invalid locations", () =>
				test.eq(utils.isLocationInRoom(data.testMap, { r: -3, c: 2 }), false));
			it("should reject invalid locations", () =>
				test.eq(utils.isLocationInRoom(data.testMap, { r: 2.4, c: 3.5 }), false));
		});

		describe("inSameRoom()", () => {
			it("should accept locations that are in the same room", () =>
				test.eq(utils.inSameRoom(data.testMap, { r: 2, c: 6 }, { r: 3, c: 9 }), true));
			it("should accept locations that are in the same room", () =>
				test.eq(utils.inSameRoom(data.testMap, { r: 15, c: 6 }, { r: 18, c: 1 }), true));
			it("should reject locations that are not in the same room", () =>
				test.eq(utils.inSameRoom(data.testMap, { r: 15, c: 6 }, { r: 3, c: 9 }), false));
			it("should reject locations that are not in rooms", () =>
				test.eq(utils.inSameRoom(data.testMap, { r: 10, c: 2 }, { r: 16, c: 10 }), false));
			it("should reject locations that are not in rooms", () =>
				test.eq(utils.inSameRoom(data.testMap, { r: 0, c: 0 }, { r: 1, c: 1 }), false));
			it("should reject invalid locations", () =>
				test.eq(utils.inSameRoom(data.testMap, { r: 2.3, c: 4.3 }, { r: -1, c: 3 }), false));
		});

		describe("inRange()", () => {
			it("should accept values that are in range", () =>
				test.eq(utils.inRange(19, 2, 100), true));
			it("should reject values that are below the range", () =>
				test.eq(utils.inRange(-5, 0, 10), false));
			it("should reject values that are above range", () =>
				test.eq(utils.inRange(64, -32, 16), false));
		});

		describe("isVisible()", () => {
			it("should accept locations that are in the same room", () =>
				test.eq(utils.isVisible(data.testMap, { r: 2, c: 6 }, { r: 3, c: 9 }), true));
			it("should accept locations that are within a 2-tile distance", () =>
				test.eq(utils.isVisible(data.testMap, { r: 8, c: 8 }, { r: 10, c: 8 }), true));
			it("should reject locations that aren't within a 2-tile distance or in the same room", () =>
				test.eq(utils.isVisible(data.testMap, { r: 14, c: 18 }, { r: 2, c: 2 }), false));
			it("should reject invalid locations", () =>
				test.eq(utils.isVisible(data.testMap, { r: 0, c: 0 }, { r: -1, c: 0 }), false));
		});

		describe("isValidLocation()", () => {
			it("should accept locations that are valid", () =>
				test.eq(utils.isValidLocation({ r: 0, c: 0 }), true));
			it("should accept locations that are valid", () =>
				test.eq(utils.isValidLocation({ r: 15150, c: 15251 }), true));
			it("should reject locations with a negative coordinate", () =>
				test.eq(utils.isValidLocation({ r: -3, c: 0 }), false));
			it("should reject locations with a decimal coordinate", () =>
				test.eq(utils.isValidLocation({ r: 2, c: 3.14 }), false));
		});

		describe("areAligned()", () => {
			it("should accept entities that are aligned", () =>
				test.eq(utils.areAligned(data.testEntity1, data.testEntity2), true));
			it("should reject entities that are not aligned", () =>
				test.eq(utils.areAligned(data.testEntity1, data.testEntity3), false));
			it("should reject entities that both have no alignment", () =>
				test.eq(utils.areAligned(data.testEntity3, data.testEntity4), false));
		});

		describe("getTile()", () => {
			it("should return the tile at the given location", () =>
				test.eq(utils.getTile(data.testMap, { r: 17, c: 2 }), data.testMap.grid[17][2]));
			it("should return the tile at the given location", () =>
				test.eq(utils.getTile(data.testMap, { r: 0, c: 0 }), data.testMap.grid[0][0]));
			it("should return an unknown tile if the location is outside the map", () =>
				test.eq(utils.getTile(data.testMap, { r: 25, c: 10 }), { type: Crawl.DungeonTileType.UNKNOWN }));
			it("should return an unknown tile if the location is outside the map", () =>
				test.eq(utils.getTile(data.testMap, { r: 1.2, c: -1 }), { type: Crawl.DungeonTileType.UNKNOWN }));
		});

		describe("locationToCoordinates()", () => {
			it("should return [0, 0] for the origin", () =>
				test.eq(utils.locationToCoordinates({ r: 0, c: 0 }, 24), [0, 0]));
			it("should return [gridSize, gridSize] for (1, 1)", () =>
				test.eq(utils.locationToCoordinates({ r: 1, c: 1 }, 24), [24, 24]));
			it("should work on larger inputs", () =>
				test.eq(utils.locationToCoordinates({ r: 10, c: 32 }, 10), [320, 100]));
			it("should work on invalid locations", () =>
				test.eq(utils.locationToCoordinates({ r: -1, c: 0.5 }, 10), [5, -10]));
		});

		describe("withinNSteps()", () => {
			it("should work for n = 0", () => {
				let locations: { [index: number]: number[] } = {
					2: [5]
				};

				utils.withinNSteps(0, { r: 2, c: 5 }, (loc) => {
					if (loc.r in locations) {
						let index = locations[loc.r].indexOf(loc.c);
						if (index >= 0) {
							locations[loc.r].splice(index, 1);
							if (locations[loc.r].length === 0) {
								delete locations[loc.r];
							}
							return;
						}
					}
					throw new Error(`Location (${loc.r}, ${loc.c}) should not get checked`);
				});

				if (Object.keys(locations).length > 0) {
					throw new Error(`Not all locations were checked`);
				}
			});

			it("should work for n = 1", () => {
				let locations: { [index: number]: number[] } = {
					2: [2, 3, 4],
					3: [2, 3, 4],
					4: [2, 3, 4]
				};

				utils.withinNSteps(1, { r: 3, c: 3 }, (loc) => {
					if (loc.r in locations) {
						let index = locations[loc.r].indexOf(loc.c);
						if (index >= 0) {
							locations[loc.r].splice(index, 1);
							if (locations[loc.r].length === 0) {
								delete locations[loc.r];
							}
							return;
						}
					}
					throw new Error(`Location (${loc.r}, ${loc.c}) should not get checked`);
				});

				if (Object.keys(locations).length > 0) {
					throw new Error(`Not all locations were checked`);
				}
			});

			it("should work for n = 2", () => {
				let locations: { [index: number]: number[] } = {
					2: [3, 4, 5, 6, 7],
					3: [3, 4, 5, 6, 7],
					4: [3, 4, 5, 6, 7],
					5: [3, 4, 5, 6, 7],
					6: [3, 4, 5, 6, 7]
				};

				utils.withinNSteps(2, { r: 4, c: 5 }, (loc) => {
					if (loc.r in locations) {
						let index = locations[loc.r].indexOf(loc.c);
						if (index >= 0) {
							locations[loc.r].splice(index, 1);
							if (locations[loc.r].length === 0) {
								delete locations[loc.r];
							}
							return;
						}
					}
					throw new Error(`Location (${loc.r}, ${loc.c}) should not get checked`);
				});

				if (Object.keys(locations).length > 0) {
					throw new Error(`Not all locations were checked`);
				}
			});

			it("should work with an invalid base location", () => {
				let locations: { [index: number]: number[] } = {
					[-3]: [-1, 0, 1],
					[-2]: [-1, 0, 1],
					[-1]: [-1, 0, 1]
				};

				utils.withinNSteps(1, { r: -2, c: 0 }, (loc) => {
					if (loc.r in locations) {
						let index = locations[loc.r].indexOf(loc.c);
						if (index >= 0) {
							locations[loc.r].splice(index, 1);
							if (locations[loc.r].length === 0) {
								delete locations[loc.r];
							}
							return;
						}
					}
					throw new Error(`Location (${loc.r}, ${loc.c}) should not get checked`);
				});

				if (Object.keys(locations).length > 0) {
					throw new Error(`Not all locations were checked`);
				}
			});
		});

		describe("isVoid()", () => {
			it("should accept an undefined input", () =>
				test.eq(utils.isVoid(undefined), true));
			it("should reject a non-void input", () =>
				test.eq(utils.isVoid(2), false));
			it("should reject a non-void input", () =>
				test.eq(utils.isVoid("undefined"), false));
			it("should reject a non-void input", () =>
				test.eq(utils.isVoid({}), false));
		});
	});
}