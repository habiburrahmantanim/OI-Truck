"use strict";
exports.__esModule = true;
exports.metadata = void 0;
require("./globals.css");
var AuthContext_1 = require("@/context/AuthContext");
var BookingContext_1 = require("@/context/BookingContext");
var DriverContext_1 = require("@/context/DriverContext");
var TruckContext_1 = require("@/context/TruckContext");
var Footer_1 = require("@/components/Footer");
exports.metadata = {
    title: "OI-Truck | Truck Lagbe",
    description: "Modern Truck Booking Platform"
};
function RootLayout(_a) {
    var children = _a.children;
    return (React.createElement("html", { lang: "en" },
        React.createElement("body", null,
            React.createElement(AuthContext_1.AuthProvider, null,
                React.createElement(TruckContext_1.TruckProvider, null,
                    React.createElement(DriverContext_1.DriverProvider, null,
                        React.createElement(BookingContext_1.BookingProvider, null,
                            children,
                            React.createElement(Footer_1["default"], null))))))));
}
exports["default"] = RootLayout;
