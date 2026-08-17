"use client";
"use strict";
exports.__esModule = true;
var link_1 = require("next/link");
var lucide_react_1 = require("lucide-react");
var BookingContext_1 = require("@/context/BookingContext");
var activity = [
    ["BK-48291", "Dhaka to Chattogram", "In Transit", "12 min ago"],
    ["BK-48290", "Gazipur to Narayanganj", "Driver Assigned", "34 min ago"],
    ["BK-48289", "Mirpur to Uttara", "Delivered", "1 hr ago"],
    ["BK-48288", "Dhaka to Cumilla", "Confirmed", "2 hrs ago"],
];
function AdminDashboard() {
    var bookings = BookingContext_1.useBookings().bookings;
    var active = bookings.filter(function (booking) {
        return !["Delivered", "Completed", "Cancelled"].includes(booking.status);
    }).length;
    var delivered = bookings.filter(function (booking) {
        return booking.status === "Delivered" || booking.status === "Completed";
    }).length;
    var revenue = bookings
        .filter(function (booking) { return booking.status !== "Cancelled"; })
        .reduce(function (sum, booking) { return sum + booking.totalPrice; }, 0);
    var rows = bookings.length
        ? bookings.slice(0, 5).map(function (booking) { return [
            booking.id,
            booking.pickupLocation + " to " + booking.deliveryLocation,
            booking.status,
            new Date(booking.createdAt).toLocaleDateString("en-BD", {
                month: "short",
                day: "numeric"
            }),
        ]; })
        : activity;
    return (React.createElement("div", { className: "mx-auto max-w-7xl" },
        React.createElement("div", { className: "flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between" },
            React.createElement("div", null,
                React.createElement("p", { className: "text-sm font-semibold text-orange-600" }, "OPERATIONS OVERVIEW"),
                React.createElement("h1", { className: "mt-1 text-2xl font-bold text-slate-900 sm:text-3xl" }, "Dashboard"),
                React.createElement("p", { className: "mt-1 text-sm text-slate-500" }, "Monitor logistics activity and fleet performance.")),
            React.createElement(link_1["default"], { href: "/admin/bookings", className: "inline-flex w-fit items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700" },
                "View all bookings",
                React.createElement(lucide_react_1.ArrowUpRight, { size: 17 }))),
        React.createElement("section", { className: "mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" },
            React.createElement(Metric, { icon: lucide_react_1.CalendarDays, label: "Total bookings", value: bookings.length, hint: active + " currently active", color: "orange" }),
            React.createElement(Metric, { icon: lucide_react_1.Truck, label: "Available trucks", value: "24", hint: "4 in maintenance", color: "blue" }),
            React.createElement(Metric, { icon: lucide_react_1.PackageCheck, label: "Delivered", value: delivered, hint: "Completed deliveries", color: "green" }),
            React.createElement(Metric, { icon: lucide_react_1.CircleDollarSign, label: "Booking value", value: "BDT " + revenue.toLocaleString(), hint: "Excludes cancelled bookings", color: "violet" })),
        React.createElement("section", { className: "mt-7 grid gap-6 xl:grid-cols-[1.65fr_1fr]" },
            React.createElement("div", { className: "overflow-hidden rounded-lg border border-slate-200 bg-white" },
                React.createElement("div", { className: "flex items-center justify-between border-b border-slate-100 px-5 py-4" },
                    React.createElement("div", null,
                        React.createElement("h2", { className: "font-bold text-slate-900" }, "Recent bookings"),
                        React.createElement("p", { className: "mt-0.5 text-sm text-slate-500" }, "Latest delivery activity")),
                    React.createElement(link_1["default"], { href: "/admin/bookings", className: "text-sm font-semibold text-orange-600" }, "Manage")),
                React.createElement("div", { className: "overflow-x-auto" },
                    React.createElement("table", { className: "w-full min-w-[580px] text-left text-sm" },
                        React.createElement("thead", { className: "bg-slate-50 text-xs uppercase tracking-wide text-slate-500" },
                            React.createElement("tr", null,
                                React.createElement("th", { className: "px-5 py-3 font-semibold" }, "Booking"),
                                React.createElement("th", { className: "px-5 py-3 font-semibold" }, "Route"),
                                React.createElement("th", { className: "px-5 py-3 font-semibold" }, "Status"),
                                React.createElement("th", { className: "px-5 py-3 font-semibold" }, "Updated"))),
                        React.createElement("tbody", null, rows.map(function (_a) {
                            var id = _a[0], route = _a[1], status = _a[2], date = _a[3];
                            return (React.createElement("tr", { key: id, className: "border-t border-slate-100" },
                                React.createElement("td", { className: "px-5 py-4 font-semibold text-slate-800" }, id),
                                React.createElement("td", { className: "max-w-[220px] truncate px-5 py-4 text-slate-600" }, route),
                                React.createElement("td", { className: "px-5 py-4" },
                                    React.createElement(Status, { status: status })),
                                React.createElement("td", { className: "px-5 py-4 text-slate-500" }, date)));
                        }))))),
            React.createElement("div", { className: "rounded-lg border border-slate-200 bg-white p-5" },
                React.createElement("h2", { className: "font-bold text-slate-900" }, "Fleet status"),
                React.createElement("p", { className: "mt-1 text-sm text-slate-500" }, "Vehicle availability today"),
                React.createElement("div", { className: "mt-7 flex items-center justify-center" },
                    React.createElement("div", { className: "relative flex h-40 w-40 items-center justify-center rounded-full border-[18px] border-orange-500 border-b-slate-200 border-r-slate-200" },
                        React.createElement("div", { className: "text-center" },
                            React.createElement("p", { className: "text-3xl font-bold text-slate-900" }, "24"),
                            React.createElement("p", { className: "text-xs text-slate-500" }, "Available")))),
                React.createElement("div", { className: "mt-7 space-y-3" },
                    React.createElement(FleetLine, { color: "bg-orange-500", label: "Available", value: "24 vehicles" }),
                    React.createElement(FleetLine, { color: "bg-blue-500", label: "On delivery", value: "17 vehicles" }),
                    React.createElement(FleetLine, { color: "bg-slate-300", label: "Maintenance", value: "4 vehicles" }))))));
}
exports["default"] = AdminDashboard;
/* ================= COMPONENTS ================= */
function Metric(_a) {
    var Icon = _a.icon, label = _a.label, value = _a.value, hint = _a.hint, color = _a.color;
    var styles = {
        orange: "bg-orange-100 text-orange-600",
        blue: "bg-blue-100 text-blue-600",
        green: "bg-green-100 text-green-600",
        violet: "bg-violet-100 text-violet-600"
    };
    return (React.createElement("article", { className: "rounded-lg border border-slate-200 bg-white p-5" },
        React.createElement("div", { className: "flex items-start justify-between" },
            React.createElement("div", null,
                React.createElement("p", { className: "text-sm font-medium text-slate-500" }, label),
                React.createElement("p", { className: "mt-2 text-2xl font-bold text-slate-900" }, value)),
            React.createElement("span", { className: "rounded-lg p-2.5 " + styles[color] },
                React.createElement(Icon, { size: 21 }))),
        React.createElement("p", { className: "mt-4 text-xs text-slate-500" }, hint)));
}
function Status(_a) {
    var status = _a.status;
    var style = status === "Delivered" || status === "Completed"
        ? "bg-green-100 text-green-700"
        : status === "In Transit"
            ? "bg-blue-100 text-blue-700"
            : status === "Cancelled"
                ? "bg-red-100 text-red-700"
                : "bg-amber-100 text-amber-700";
    return (React.createElement("span", { className: "whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold " + style }, status));
}
function FleetLine(_a) {
    var color = _a.color, label = _a.label, value = _a.value;
    return (React.createElement("div", { className: "flex items-center justify-between text-sm" },
        React.createElement("span", { className: "flex items-center gap-2 text-slate-600" },
            React.createElement("i", { className: "h-2.5 w-2.5 rounded-full " + color }),
            label),
        React.createElement("span", { className: "font-semibold text-slate-800" }, value)));
}
