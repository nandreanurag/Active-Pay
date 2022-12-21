import Axios from 'axios';
//using axios for fetchning api

const axios = Axios.create({
  baseURL: `${
    process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_BACKEND_URL_DEV
      : process.env.REACT_APP_BACKEND_URL_PROD
  }`,
});

(function testing(){

  //testing
  console.log(process.env)
})()

export default axios;
