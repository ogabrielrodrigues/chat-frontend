import { Axios } from "axios";

const axios = new Axios({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

export { axios };
