import axios from 'axios';

const instance = axios.create({
    baseURL : "http://192.168.0.22:8000/"
})
instance.defaults.withCredentials = true
instance.defaults.xsrfHeaderName = "csrftoken";

export default instance;