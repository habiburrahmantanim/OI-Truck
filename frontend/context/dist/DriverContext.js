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
exports.useDrivers = exports.DriverProvider = void 0;
var react_1 = require("react");
var drivers_1 = require("@/data/drivers");
var DriverContext = react_1.createContext(undefined);
function DriverProvider(_a) {
    var children = _a.children;
    var _b = react_1.useState(drivers_1.initialDrivers), drivers = _b[0], setDrivers = _b[1];
    var _c = react_1.useState(false), isLoaded = _c[0], setIsLoaded = _c[1];
    /* LOAD */
    react_1.useEffect(function () {
        var savedDrivers = localStorage.getItem("trucklagbe_drivers");
        if (savedDrivers) {
            try {
                setDrivers(JSON.parse(savedDrivers));
            }
            catch (error) {
                console.error("Failed to load drivers", error);
            }
        }
        setIsLoaded(true);
    }, []);
    /* SAVE */
    react_1.useEffect(function () {
        if (!isLoaded)
            return;
        localStorage.setItem("trucklagbe_drivers", JSON.stringify(drivers));
    }, [drivers, isLoaded]);
    function addDriver(driver) {
        setDrivers(function (previousDrivers) { return __spreadArrays(previousDrivers, [driver]); });
    }
    function updateDriver(driver) {
        setDrivers(function (previousDrivers) {
            return previousDrivers.map(function (item) { return (item.id === driver.id ? driver : item); });
        });
    }
    function getDriverById(id) {
        return drivers.find(function (driver) { return driver.id === id; });
    }
    function updateDriverStatus(id, status) {
        setDrivers(function (previousDrivers) {
            return previousDrivers.map(function (driver) {
                return driver.id === id
                    ? __assign(__assign({}, driver), { status: status }) : driver;
            });
        });
    }
    function updateDriverAvailability(id, availability) {
        setDrivers(function (previousDrivers) {
            return previousDrivers.map(function (driver) {
                return driver.id === id
                    ? __assign(__assign({}, driver), { availability: availability }) : driver;
            });
        });
    }
    function deleteDriver(id) {
        setDrivers(function (previousDrivers) {
            return previousDrivers.filter(function (driver) { return driver.id !== id; });
        });
    }
    return (React.createElement(DriverContext.Provider, { value: {
            drivers: drivers,
            isLoaded: isLoaded,
            addDriver: addDriver,
            updateDriver: updateDriver,
            getDriverById: getDriverById,
            updateDriverStatus: updateDriverStatus,
            updateDriverAvailability: updateDriverAvailability,
            deleteDriver: deleteDriver
        } }, children));
}
exports.DriverProvider = DriverProvider;
function useDrivers() {
    var context = react_1.useContext(DriverContext);
    if (!context) {
        throw new Error("useDrivers must be used inside DriverProvider");
    }
    return context;
}
exports.useDrivers = useDrivers;
