"use client";
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.useTrucks = exports.TruckProvider = void 0;
var react_1 = require("react");
var data_1 = require("@/data/data");
var TruckContext = react_1.createContext(undefined);
function TruckProvider(_a) {
    var children = _a.children;
    var _b = react_1.useState(data_1.trucks), trucks = _b[0], setTrucks = _b[1];
    var _c = react_1.useState(false), isLoaded = _c[0], setIsLoaded = _c[1];
    /* LOAD */
    react_1.useEffect(function () {
        var savedTrucks = localStorage.getItem("trucklagbe_trucks");
        if (savedTrucks) {
            try {
                setTrucks(JSON.parse(savedTrucks));
            }
            catch (error) {
                console.error("Failed to load trucks", error);
            }
        }
        setIsLoaded(true);
    }, []);
    /* SAVE */
    react_1.useEffect(function () {
        if (!isLoaded)
            return;
        localStorage.setItem("trucklagbe_trucks", JSON.stringify(trucks));
    }, [trucks, isLoaded]);
    function addTruck(truck) {
        setTrucks(function (previousTrucks) { return __spreadArrays(previousTrucks, [truck]); });
    }
    function updateTruck(updatedTruck) {
        setTrucks(function (previousTrucks) {
            return previousTrucks.map(function (truck) {
                return truck.id === updatedTruck.id ? updatedTruck : truck;
            });
        });
    }
    function deleteTruck(id) {
        setTrucks(function (previousTrucks) {
            return previousTrucks.filter(function (truck) { return truck.id !== id; });
        });
    }
    function getTruckById(id) {
        return trucks.find(function (truck) { return truck.id === id; });
    }
    function updateTruckAvailability(id, available) {
        setTrucks(function (previousTrucks) {
            return previousTrucks.map(function (truck) {
                return truck.id === id
                    ? __assign(__assign({}, truck), { available: available }) : truck;
            });
        });
    }
    return (React.createElement(TruckContext.Provider, { value: {
            trucks: trucks,
            isLoaded: isLoaded,
            addTruck: addTruck,
            updateTruck: updateTruck,
            deleteTruck: deleteTruck,
            getTruckById: getTruckById,
            updateTruckAvailability: updateTruckAvailability
        } }, children));
}
exports.TruckProvider = TruckProvider;
function useTrucks() {
    var context = react_1.useContext(TruckContext);
    if (!context) {
        throw new Error("useTrucks must be used inside TruckProvider");
    }
    return context;
}
exports.useTrucks = useTrucks;
