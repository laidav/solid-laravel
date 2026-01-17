import axios, { type AxiosInstance } from "axios";
import { Subject } from "rxjs";

/**
 * Base abstraction for making an axios call to our servers
 * Provides some defaults such as headers and API base url.
 *
 * It is recommended to use this class with a 'Service' class that represents a set of calls
 * e.g. PriceService.getQuote - has an internal reference to an API object and prepares a call
 *
 * Calls return axios objects, so they can be used the same as axios.
 */
class API {
  static base = import.meta.env.VITE_API_BASE_URL;

  static defaultHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  _instance: AxiosInstance | null = null;
  _unauthorizedResponse$ = new Subject<void>();

  constructor(credentials = true) {
    this._instance = axios.create({
      withCredentials: credentials,
      withXSRFToken: credentials,
      baseURL: API.base,
      headers: API.defaultHeaders,
    });

    this._instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this._unauthorizedResponse$.next();
        }
        return Promise.reject(error);
      },
    );
  }

  unauthorizedResponse$ = this._unauthorizedResponse$.asObservable();

  get = ({ location, params }: { location: string; params: any }) => {
    return this._instance?.get(location, { params });
  };

  delete = ({ location, params }: { location: string; params: any }) => {
    return this._instance?.delete(location, { params });
  };

  post = ({
    location,
    body,
    config = {},
  }: {
    location: string;
    body: any;
    config?: any;
  }) => {
    return this._instance?.post(location, body, config);
  };

  put = ({
    location,
    body,
    config,
  }: {
    location: string;
    body: any;
    config: any;
  }) => {
    return this._instance?.put(location, body, config);
  };

  patch = ({
    location,
    body,
    config,
  }: {
    location: string;
    body: any;
    config: any;
  }) => {
    return this._instance?.patch(location, body, config);
  };
}

export default API;
