"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var DriverContext_1 = require("@/context/DriverContext");
function AdminDriversPage() {
    var _a = DriverContext_1.useDrivers(), drivers = _a.drivers, isLoaded = _a.isLoaded, updateDriverStatus = _a.updateDriverStatus, updateDriverAvailability = _a.updateDriverAvailability, deleteDriver = _a.deleteDriver;
    var _b = react_1.useState(""), search = _b[0], setSearch = _b[1];
    var _c = react_1.useState("all"), statusFilter = _c[0], setStatusFilter = _c[1];
    var filteredDrivers = react_1.useMemo(function () {
        return drivers.filter(function (driver) {
            var query = search.toLowerCase();
            var matchesSearch = driver.name.toLowerCase().includes(query) ||
                driver.email.toLowerCase().includes(query) ||
                driver.phone.includes(search) ||
                driver.vehicleNumber.toLowerCase().includes(query);
            var matchesStatus = statusFilter === "all" || driver.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [drivers, search, statusFilter]);
    var pendingDrivers = drivers.filter(function (driver) { return driver.status === "pending"; }).length;
    var approvedDrivers = drivers.filter(function (driver) { return driver.status === "approved"; }).length;
    var suspendedDrivers = drivers.filter(function (driver) { return driver.status === "suspended"; }).length;
    function handleApprove(driver) {
        updateDriverStatus(driver.id, "approved");
        if (driver.availability === "offline") {
            updateDriverAvailability(driver.id, "available");
        }
    }
    function handleReject(driver) {
        updateDriverStatus(driver.id, "rejected");
        updateDriverAvailability(driver.id, "offline");
    }
    function handleSuspend(driver) {
        updateDriverStatus(driver.id, "suspended");
        updateDriverAvailability(driver.id, "offline");
    }
    function handleAvailabilityChange(driver, availability) {
        if (driver.status !== "approved") {
            alert("Only approved drivers can change availability.");
            return;
        }
        updateDriverAvailability(driver.id, availability);
    }
    function handleDelete(driver) {
        var confirmed = window.confirm("Are you sure you want to delete " + driver.name + "?");
        if (!confirmed)
            return;
        deleteDriver(driver.id);
    }
    if (!isLoaded) {
        return (React.createElement("div", { className: "flex min-h-[60vh] items-center justify-center" },
            React.createElement("div", { className: "text-center" },
                React.createElement("div", { className: "mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" }),
                React.createElement("p", { className: "mt-4 text-sm font-medium text-slate-500" }, "Loading drivers..."))));
    }
    return (React.createElement("div", { className: "mx-auto max-w-7xl" },
        React.createElement("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between" },
            React.createElement("div", null,
                React.createElement("p", { className: "text-sm font-semibold text-orange-600" }, "DRIVER MANAGEMENT"),
                React.createElement("h1", { className: "mt-1 text-2xl font-bold text-slate-900 sm:text-3xl" }, "Drivers"),
                React.createElement("p", { className: "mt-1 text-sm text-slate-500" }, "Review driver applications and manage your delivery team.")),
            React.createElement("div", { className: "rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-600" },
                "Total Drivers:",
                " ",
                React.createElement("span", { className: "font-bold text-slate-900" }, drivers.length))),
        React.createElement("section", { className: "mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" },
            React.createElement(StatCard, { icon: React.createElement(lucide_react_1.UserRound, { size: 22 }), label: "Total Drivers", value: drivers.length, color: "orange" }),
            React.createElement(StatCard, { icon: React.createElement(lucide_react_1.Clock3, { size: 22 }), label: "Pending Approval", value: pendingDrivers, color: "amber" }),
            React.createElement(StatCard, { icon: React.createElement(lucide_react_1.UserCheck, { size: 22 }), label: "Approved", value: approvedDrivers, color: "green" }),
            React.createElement(StatCard, { icon: React.createElement(lucide_react_1.ShieldAlert, { size: 22 }), label: "Suspended", value: suspendedDrivers, color: "red" })),
        React.createElement("section", { className: "mt-7 rounded-lg border border-slate-200 bg-white p-4 sm:p-5" },
            React.createElement("div", { className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between" },
                React.createElement("div", { className: "relative w-full md:max-w-md" },
                    React.createElement(lucide_react_1.Search, { size: 19, className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }),
                    React.createElement("input", { value: search, onChange: function (event) { return setSearch(event.target.value); }, placeholder: "Search driver, email, phone or vehicle...", className: "w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100" })),
                React.createElement("select", { value: statusFilter, onChange: function (event) {
                        return setStatusFilter(event.target.value);
                    }, className: "rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-orange-500" },
                    React.createElement("option", { value: "all" }, "All Status"),
                    React.createElement("option", { value: "pending" }, "Pending"),
                    React.createElement("option", { value: "approved" }, "Approved"),
                    React.createElement("option", { value: "rejected" }, "Rejected"),
                    React.createElement("option", { value: "suspended" }, "Suspended")))),
        React.createElement("section", { className: "mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white" },
            React.createElement("div", { className: "flex items-center justify-between border-b border-slate-100 px-5 py-4" },
                React.createElement("div", null,
                    React.createElement("h2", { className: "font-bold text-slate-900" }, "Driver Applications"),
                    React.createElement("p", { className: "mt-1 text-sm text-slate-500" },
                        filteredDrivers.length,
                        " driver(s) found"))),
            React.createElement("div", { className: "overflow-x-auto" },
                React.createElement("table", { className: "w-full min-w-[1250px] text-left text-sm" },
                    React.createElement("thead", { className: "bg-slate-50 text-xs uppercase tracking-wide text-slate-500" },
                        React.createElement("tr", null,
                            React.createElement("th", { className: "px-5 py-4 font-semibold" }, "Driver"),
                            React.createElement("th", { className: "px-5 py-4 font-semibold" }, "Contact"),
                            React.createElement("th", { className: "px-5 py-4 font-semibold" }, "Vehicle"),
                            React.createElement("th", { className: "px-5 py-4 font-semibold" }, "Status"),
                            React.createElement("th", { className: "px-5 py-4 font-semibold" }, "Availability"),
                            React.createElement("th", { className: "px-5 py-4 font-semibold" }, "Trips"),
                            React.createElement("th", { className: "px-5 py-4 font-semibold" }, "Actions"))),
                    React.createElement("tbody", null,
                        filteredDrivers.map(function (driver) { return (React.createElement("tr", { key: driver.id, className: "border-t border-slate-100 hover:bg-slate-50" },
                            React.createElement("td", { className: "px-5 py-4" },
                                React.createElement("div", { className: "flex items-center gap-3" },
                                    React.createElement("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600" }, driver.name.charAt(0).toUpperCase()),
                                    React.createElement("div", null,
                                        React.createElement("p", { className: "font-semibold text-slate-900" }, driver.name),
                                        React.createElement("p", { className: "text-xs text-slate-500" },
                                            "License: ",
                                            driver.licenseNumber)))),
                            React.createElement("td", { className: "px-5 py-4" },
                                React.createElement("p", { className: "text-slate-700" }, driver.email),
                                React.createElement("p", { className: "mt-1 text-xs text-slate-500" }, driver.phone)),
                            React.createElement("td", { className: "px-5 py-4" },
                                React.createElement("div", { className: "flex items-center gap-2" },
                                    React.createElement(lucide_react_1.Car, { size: 17, className: "text-slate-400" }),
                                    React.createElement("div", null,
                                        React.createElement("p", { className: "font-medium text-slate-700" }, driver.vehicleType),
                                        React.createElement("p", { className: "text-xs text-slate-500" }, driver.vehicleNumber)))),
                            React.createElement("td", { className: "px-5 py-4" },
                                React.createElement(StatusBadge, { status: driver.status })),
                            React.createElement("td", { className: "px-5 py-4" },
                                React.createElement("select", { value: driver.availability, disabled: driver.status !== "approved", onChange: function (event) {
                                        return handleAvailabilityChange(driver, event.target.value);
                                    }, className: "rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold capitalize text-slate-700 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400" },
                                    React.createElement("option", { value: "available" }, "Available"),
                                    React.createElement("option", { value: "busy" }, "Busy"),
                                    React.createElement("option", { value: "offline" }, "Offline"))),
                            React.createElement("td", { className: "px-5 py-4" },
                                React.createElement("p", { className: "font-semibold text-slate-800" }, driver.totalTrips),
                                React.createElement("p", { className: "mt-1 text-xs text-slate-500" },
                                    "Rating: ",
                                    driver.rating.toFixed(1))),
                            React.createElement("td", { className: "px-5 py-4" },
                                React.createElement("div", { className: "flex flex-wrap gap-2" },
                                    driver.status === "pending" && (React.createElement(React.Fragment, null,
                                        React.createElement("button", { onClick: function () { return handleApprove(driver); }, className: "inline-flex items-center gap-1 rounded-lg bg-green-50 px-3 py-2 text-xs font-bold text-green-600 hover:bg-green-100" },
                                            React.createElement(lucide_react_1.CheckCircle2, { size: 14 }),
                                            "Approve"),
                                        React.createElement("button", { onClick: function () { return handleReject(driver); }, className: "inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100" },
                                            React.createElement(lucide_react_1.XCircle, { size: 14 }),
                                            "Reject"))),
                                    driver.status === "approved" && (React.createElement("button", { onClick: function () { return handleSuspend(driver); }, className: "inline-flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100" },
                                        React.createElement(lucide_react_1.UserX, { size: 14 }),
                                        "Suspend")),
                                    driver.status === "suspended" && (React.createElement("button", { onClick: function () { return handleApprove(driver); }, className: "inline-flex items-center gap-1 rounded-lg bg-green-50 px-3 py-2 text-xs font-bold text-green-600 hover:bg-green-100" },
                                        React.createElement(lucide_react_1.UserCheck, { size: 14 }),
                                        "Reactivate")),
                                    React.createElement("button", { onClick: function () { return handleDelete(driver); }, className: "inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-red-50 hover:text-red-600" },
                                        React.createElement(lucide_react_1.Trash2, { size: 14 }),
                                        "Delete"))))); }),
                        filteredDrivers.length === 0 && (React.createElement("tr", null,
                            React.createElement("td", { colSpan: 7, className: "px-5 py-16 text-center" },
                                React.createElement(lucide_react_1.UserRound, { size: 40, className: "mx-auto text-slate-300" }),
                                React.createElement("h3", { className: "mt-3 font-bold text-slate-700" }, "No drivers found"),
                                React.createElement("p", { className: "mt-1 text-sm text-slate-500" }, "Try changing your search or filter."))))))))));
}
exports["default"] = AdminDriversPage;
/* ================= STAT CARD ================= */
function StatCard(_a) {
    var icon = _a.icon, label = _a.label, value = _a.value, color = _a.color;
    var colors = {
        orange: "bg-orange-100 text-orange-600",
        amber: "bg-amber-100 text-amber-600",
        green: "bg-green-100 text-green-600",
        red: "bg-red-100 text-red-600"
    };
    return (React.createElement("article", { className: "rounded-lg border border-slate-200 bg-white p-5" },
        React.createElement("div", { className: "flex items-start justify-between" },
            React.createElement("div", null,
                React.createElement("p", { className: "text-sm font-medium text-slate-500" }, label),
                React.createElement("p", { className: "mt-2 text-2xl font-bold text-slate-900" }, value)),
            React.createElement("div", { className: "rounded-lg p-2.5 " + colors[color] }, icon))));
}
/* ================= STATUS BADGE ================= */
function StatusBadge(_a) {
    var status = _a.status;
    var styles = {
        pending: "bg-amber-100 text-amber-700",
        approved: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-700",
        suspended: "bg-slate-200 text-slate-700"
    };
    return (React.createElement("span", { className: "inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize " + styles[status] }, status));
}
