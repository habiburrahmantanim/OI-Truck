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
exports.useBookings = exports.BookingProvider = void 0;
var react_1 = require("react");
var BookingContext = react_1.createContext(undefined);
function BookingProvider(_a) {
    var children = _a.children;
    var _b = react_1.useState([]), bookings = _b[0], setBookings = _b[1];
    var _c = react_1.useState(false), isLoaded = _c[0], setIsLoaded = _c[1];
    react_1.useEffect(function () {
        try {
            var savedBookings = localStorage.getItem("trucklagbe_bookings");
            if (savedBookings) {
                setBookings(JSON.parse(savedBookings));
            }
        }
        catch (error) {
            console.error("Failed to load bookings:", error);
        }
        finally {
            setIsLoaded(true);
        }
    }, []);
    react_1.useEffect(function () {
        if (!isLoaded)
            return;
        localStorage.setItem("trucklagbe_bookings", JSON.stringify(bookings));
    }, [bookings, isLoaded]);
    function addBooking(booking) {
        setBookings(function (previousBookings) { return __spreadArrays([booking], previousBookings); });
    }
    function getBookingById(id) {
        return bookings.find(function (booking) { return booking.id === id; });
    }
    function updateBookingStatus(id, status) {
        setBookings(function (previousBookings) {
            return previousBookings.map(function (booking) {
                return booking.id === id
                    ? __assign(__assign({}, booking), { status: status }) : booking;
            });
        });
    }
    function updateBooking(updatedBooking) {
        setBookings(function (previousBookings) {
            return previousBookings.map(function (booking) {
                return booking.id === updatedBooking.id ? updatedBooking : booking;
            });
        });
    }
    function deleteBooking(id) {
        setBookings(function (previousBookings) {
            return previousBookings.filter(function (booking) { return booking.id !== id; });
        });
    }
    return (React.createElement(BookingContext.Provider, { value: {
            bookings: bookings,
            addBooking: addBooking,
            getBookingById: getBookingById,
            updateBookingStatus: updateBookingStatus,
            updateBooking: updateBooking,
            deleteBooking: deleteBooking
        } }, children));
}
exports.BookingProvider = BookingProvider;
function useBookings() {
    var context = react_1.useContext(BookingContext);
    if (!context) {
        throw new Error("useBookings must be used inside BookingProvider");
    }
    return context;
}
exports.useBookings = useBookings;
