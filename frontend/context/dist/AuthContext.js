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
exports.useAuth = exports.AuthProvider = void 0;
var react_1 = require("react");
var users_1 = require("@/data/users");
var AuthContext = react_1.createContext(undefined);
function AuthProvider(_a) {
    var children = _a.children;
    var _b = react_1.useState(null), user = _b[0], setUser = _b[1];
    var _c = react_1.useState(users_1.initialUsers), users = _c[0], setUsers = _c[1];
    var _d = react_1.useState(false), isLoaded = _d[0], setIsLoaded = _d[1];
    /* LOAD DATA */
    react_1.useEffect(function () {
        var savedUsers = localStorage.getItem("trucklagbe_users");
        var savedUser = localStorage.getItem("trucklagbe_current_user");
        if (savedUsers) {
            try {
                setUsers(JSON.parse(savedUsers));
            }
            catch (error) {
                console.error("Failed to load users", error);
            }
        }
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            }
            catch (error) {
                console.error("Failed to load current user", error);
            }
        }
        setIsLoaded(true);
    }, []);
    /* SAVE USERS */
    react_1.useEffect(function () {
        if (!isLoaded)
            return;
        localStorage.setItem("trucklagbe_users", JSON.stringify(users));
    }, [users, isLoaded]);
    /* LOGIN */
    function login(email, password) {
        var foundUser = users.find(function (item) {
            return item.email.toLowerCase() === email.toLowerCase() &&
                item.password === password;
        });
        if (!foundUser) {
            return {
                success: false,
                message: "Invalid email or password."
            };
        }
        if (!foundUser.isActive) {
            return {
                success: false,
                message: "Your account is currently inactive."
            };
        }
        setUser(foundUser);
        localStorage.setItem("trucklagbe_current_user", JSON.stringify(foundUser));
        return {
            success: true,
            user: foundUser
        };
    }
    /* REGISTER */
    function register(userData) {
        var exists = users.some(function (item) { return item.email.toLowerCase() === userData.email.toLowerCase(); });
        if (exists) {
            return {
                success: false,
                message: "This email is already registered."
            };
        }
        var newUser = __assign(__assign({}, userData), { id: "user-" + Date.now(), isActive: true, createdAt: new Date().toISOString() });
        setUsers(function (previousUsers) { return __spreadArrays(previousUsers, [newUser]); });
        return {
            success: true,
            message: "Registration successful."
        };
    }
    /* LOGOUT */
    function logout() {
        setUser(null);
        localStorage.removeItem("trucklagbe_current_user");
    }
    /* UPDATE USER */
    function updateUser(updatedUser) {
        setUsers(function (previousUsers) {
            return previousUsers.map(function (item) {
                return item.id === updatedUser.id ? updatedUser : item;
            });
        });
        if ((user === null || user === void 0 ? void 0 : user.id) === updatedUser.id) {
            setUser(updatedUser);
            localStorage.setItem("trucklagbe_current_user", JSON.stringify(updatedUser));
        }
    }
    function getUsersByRole(role) {
        return users.filter(function (item) { return item.role === role; });
    }
    return (React.createElement(AuthContext.Provider, { value: {
            user: user,
            users: users,
            isLoaded: isLoaded,
            login: login,
            register: register,
            logout: logout,
            updateUser: updateUser,
            getUsersByRole: getUsersByRole
        } }, children));
}
exports.AuthProvider = AuthProvider;
function useAuth() {
    var context = react_1.useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
}
exports.useAuth = useAuth;
