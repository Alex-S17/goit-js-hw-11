const axios = require('axios').default; // This string is need in case 
// when the library Axios uses in the module. If Axios uses in index.js 
// (without module), you should use " import axios from 'axios'; " 
// in index.js

const KEY = '30789164-35a7cf56b7677b8602e966f0f';

export default async function requestImages(userRequest, page) {
  const response = await axios.get(`https://pixabay.com/api/?key=${KEY}&q=${userRequest}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`);
  return response;
}