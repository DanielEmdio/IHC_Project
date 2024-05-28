import { jwtDecode } from 'jwt-decode';
import { api } from "../api";

export function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }

    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }

    return null;
}

export function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export function isNormalUser() {
    const token = getCookie("token");
    if (token) {
        // const decoded = jwt_decode(token);
        // setUser(decoded);

        return jwtDecode(token)["isNormalUser"];
    } else {
        // setUser(null);
        return null;
    }
}

export function checkAuthentication() {
    const cookie = getCookie("token");
    if (cookie === null) {
        if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
            window.location.pathname = "/login";
        }

        return;
    }

    api.post("/users/checkAuthentication", { token: cookie }).then((r) => {
        const data = r.data;

        // check for errors
        if (data["result"] !== "ok") {
            if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
                window.location.pathname = "/login";
            }

            return;
        }

        // redirect the user
        if (window.location.pathname === "/login" || window.location.pathname === "/register") {
            goToHome();
        }
    }).catch((_) => { });
}

export function goToHome() {
    window.location.pathname = "/";
}

export function goToRegisterDetails() {
    window.location.pathname = "/register/trainer/details";
}
