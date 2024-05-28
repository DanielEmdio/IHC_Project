import axios from "axios";

let API_URL = "";
if (process.env.NODE_ENV === "production" || process.env.REACT_APP_DOCKER_CONTAINER) {
    API_URL = `${window.location.origin}/api`;
} else {
    API_URL = "http://localhost:8000";
}

const api = axios.create({
    baseURL: API_URL
});

export { api, API_URL };
