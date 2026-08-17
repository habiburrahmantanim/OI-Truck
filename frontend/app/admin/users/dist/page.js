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
exports.__esModule = true;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var AuthContext_1 = require("@/context/AuthContext");
function AdminUsersPage() {
    var _a = AuthContext_1.useAuth(), users = _a.users, isLoaded = _a.isLoaded, updateUser = _a.updateUser;
    var _b = react_1.useState(""), search = _b[0], setSearch = _b[1];
    var _c = react_1.useState("all"), roleFilter = _c[0], setRoleFilter = _c[1];
    var filteredUsers = react_1.useMemo(function () {
        return users.filter(function (user) {
            var matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase()) ||
                user.phone.includes(search);
            var matchesRole = roleFilter === "all" || user.role === roleFilter;
            return matchesSearch && matchesRole;
        });
    }, [users, search, roleFilter]);
    var customers = users.filter(function (user) { return user.role === "customer"; }).length;
    var drivers = users.filter(function (user) { return user.role === "driver"; }).length;
    var admins = users.filter(function (user) { return user.role === "admin"; }).length;
    var activeUsers = users.filter(function (user) { return user.isActive; }).length;
    function toggleUserStatus(user) {
        updateUser(__assign(__assign({}, user), { isActive: !user.isActive }));
    }
    if (!isLoaded) {
        return (React.createElement("div", { className: "flex min-h-[60vh] items-center justify-center" },
            React.createElement("div", { className: "text-center" },
                React.createElement("div", { className: "mx-auto h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" }),
                React.createElement("p", { className: "mt-4 text-sm font-medium text-slate-500" }, "Loading users..."))));
    }
    return (React.createElement("div", { className: "mx-auto max-w-7xl" },
        React.createElement("div", { className: "flex flex-col gap-3 md:flex-row md:items-end md:justify-between" },
            React.createElement("div", null,
                React.createElement("p", { className: "text-sm font-semibold text-orange-600" }, "USER MANAGEMENT"),
                React.createElement("h1", { className: "mt-1 text-2xl font-bold text-slate-900 sm:text-3xl" }, "Users"),
                React.createElement("p", { className: "mt-1 text-sm text-slate-500" }, "Manage customers, drivers, and administrators.")),
            React.createElement("div", { className: "rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600" },
                "Total:",
                " ",
                React.createElement("span", { className: "font-bold text-slate-900" }, users.length))),
        React.createElement("section", { className: "mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" },
            React.createElement(StatCard, { icon: React.createElement(lucide_react_1.Users, { size: 22 }), label: "Total Users", value: users.length, color: "orange" }),
            React.createElement(StatCard, { icon: React.createElement(lucide_react_1.UserCheck, { size: 22 }), label: "Active Users", value: activeUsers, color: "green" }),
            React.createElement(StatCard, { icon: React.createElement(lucide_react_1.Users, { size: 22 }), label: "Customers", value: customers, color: "blue" }),
            React.createElement(StatCard, { icon: React.createElement(lucide_react_1.ShieldCheck, { size: 22 }), label: "Drivers", value: drivers, color: "violet" })),
        React.createElement("section", { className: "mt-7 rounded-lg border border-slate-200 bg-white p-4 sm:p-5" },
            React.createElement("div", { className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between" },
                React.createElement("div", { className: "relative w-full md:max-w-md" },
                    React.createElement(lucide_react_1.Search, { size: 19, className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }),
                    React.createElement("input", { type: "text", value: search, onChange: function (event) { return setSearch(event.target.value); }, placeholder: "Search by name, email or phone...", className: "w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100" })),
                React.createElement("select", { value: roleFilter, onChange: function (event) {
                        return setRoleFilter(event.target.value);
                    }, className: "rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-orange-500" },
                    React.createElement("option", { value: "all" }, "All Roles"),
                    React.createElement("option", { value: "customer" }, "Customers"),
                    React.createElement("option", { value: "driver" }, "Drivers"),
                    React.createElement("option", { value: "admin" }, "Admins")))),
        React.createElement("section", { className: "mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white" },
            React.createElement("div", { className: "border-b border-slate-100 px-5 py-4" },
                React.createElement("h2", { className: "font-bold text-slate-900" }, "All Users"),
                React.createElement("p", { className: "mt-1 text-sm text-slate-500" },
                    filteredUsers.length,
                    " user(s) found")),
            React.createElement("div", { className: "overflow-x-auto" },
                React.createElement("table", { className: "w-full min-w-[950px] text-left text-sm" },
                    React.createElement("thead", { className: "bg-slate-50 text-xs uppercase tracking-wide text-slate-500" },
                        React.createElement("tr", null,
                            React.createElement("th", { className: "px-5 py-4 font-semibold" }, "User"),
                            React.createElement("th", { className: "px-5 py-4 font-semibold" }, "Contact"),
                            React.createElement("th", { className: "px-5 py-4 font-semibold" }, "Role"),
                            React.createElement("th", { className: "px-5 py-4 font-semibold" }, "Joined"),
                            React.createElement("th", { className: "px-5 py-4 font-semibold" }, "Status"),
                            React.createElement("th", { className: "px-5 py-4 text-right font-semibold" }, "Action"))),
                    React.createElement("tbody", null,
                        filteredUsers.map(function (user) { return (React.createElement("tr", { key: user.id, className: "border-t border-slate-100 transition hover:bg-slate-50" },
                            React.createElement("td", { className: "px-5 py-4" },
                                React.createElement("div", { className: "flex items-center gap-3" },
                                    React.createElement("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600" }, user.name.charAt(0).toUpperCase()),
                                    React.createElement("div", null,
                                        React.createElement("p", { className: "font-semibold text-slate-900" }, user.name),
                                        React.createElement("p", { className: "text-xs text-slate-500" },
                                            "ID: ",
                                            user.id)))),
                            React.createElement("td", { className: "px-5 py-4" },
                                React.createElement("div", { className: "space-y-1" },
                                    React.createElement("div", { className: "flex items-center gap-2 text-slate-600" },
                                        React.createElement(lucide_react_1.Mail, { size: 14 }),
                                        user.email),
                                    React.createElement("div", { className: "flex items-center gap-2 text-slate-500" },
                                        React.createElement(lucide_react_1.Phone, { size: 14 }),
                                        user.phone))),
                            React.createElement("td", { className: "px-5 py-4" },
                                React.createElement(RoleBadge, { role: user.role })),
                            React.createElement("td", { className: "px-5 py-4" },
                                React.createElement("div", { className: "flex items-center gap-2 text-slate-500" },
                                    React.createElement(lucide_react_1.CalendarDays, { size: 15 }),
                                    new Date(user.createdAt).toLocaleDateString("en-BD", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric"
                                    }))),
                            React.createElement("td", { className: "px-5 py-4" }, user.isActive ? (React.createElement("span", { className: "inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700" }, "Active")) : (React.createElement("span", { className: "inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700" }, "Suspended"))),
                            React.createElement("td", { className: "px-5 py-4 text-right" },
                                React.createElement("button", { onClick: function () { return toggleUserStatus(user); }, className: "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition " + (user.isActive
                                        ? "bg-red-50 text-red-600 hover:bg-red-100"
                                        : "bg-green-50 text-green-600 hover:bg-green-100") }, user.isActive ? (React.createElement(React.Fragment, null,
                                    React.createElement(lucide_react_1.UserX, { size: 15 }),
                                    "Suspend")) : (React.createElement(React.Fragment, null,
                                    React.createElement(lucide_react_1.UserCheck, { size: 15 }),
                                    "Activate")))))); }),
                        filteredUsers.length === 0 && (React.createElement("tr", null,
                            React.createElement("td", { colSpan: 6, className: "px-5 py-14 text-center" },
                                React.createElement(lucide_react_1.Users, { size: 38, className: "mx-auto text-slate-300" }),
                                React.createElement("h3", { className: "mt-3 font-bold text-slate-700" }, "No users found"),
                                React.createElement("p", { className: "mt-1 text-sm text-slate-500" }, "Try changing your search or filter."))))))))));
}
exports["default"] = AdminUsersPage;
/* =========================
   STAT CARD
========================= */
function StatCard(_a) {
    var icon = _a.icon, label = _a.label, value = _a.value, color = _a.color;
    var colors = {
        orange: "bg-orange-100 text-orange-600",
        green: "bg-green-100 text-green-600",
        blue: "bg-blue-100 text-blue-600",
        violet: "bg-violet-100 text-violet-600"
    };
    return (React.createElement("article", { className: "rounded-lg border border-slate-200 bg-white p-5" },
        React.createElement("div", { className: "flex items-start justify-between" },
            React.createElement("div", null,
                React.createElement("p", { className: "text-sm font-medium text-slate-500" }, label),
                React.createElement("p", { className: "mt-2 text-2xl font-bold text-slate-900" }, value)),
            React.createElement("div", { className: "rounded-lg p-2.5 " + colors[color] }, icon))));
}
/* =========================
   ROLE BADGE
========================= */
function RoleBadge(_a) {
    var role = _a.role;
    var styles = {
        customer: "bg-blue-100 text-blue-700",
        driver: "bg-violet-100 text-violet-700",
        admin: "bg-orange-100 text-orange-700"
    };
    return (React.createElement("span", { className: "inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize " + styles[role] }, role));
}
