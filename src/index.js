
// import requestImages from './requestImages';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';

const axios = require('axios');
let lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

const KEY = '30789164-35a7cf56b7677b8602e966f0f';

let page = 1;
let userRequest = '';
let userRequestStorage;
const totalPage = 500 / 40;

const formEl = document.querySelector('#search-form');
const setCardEl = document.querySelector('.gallery');
const loadMoreEl = document.querySelector('.load-more');

loadMoreEl.classList.add('is-hidden');

formEl.addEventListener('submit', onSubmit);

function onSubmit(event) {
  event.preventDefault();
  loadMoreEl.classList.add('is-hidden');
  page = 1;
  userRequest = event.currentTarget.searchQuery.value.trim();
  
    setCardEl.innerHTML = '';
  userRequestStorage = userRequest;
 

  requestImages(userRequestStorage, page) 
    .then(response => {
      const arrayOfImages = response.data.hits;
      const numberOfImages = response.data.totalHits;
       
      // if (numberOfImages > 40) {
      //   loadMoreEl.classList.remove('is-hidden');
      // } else {loadMoreEl.classList.add('is-hidden');}
      
      
      if (arrayOfImages.length === 0) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return;
      }
      if (page === 1) {
        Notiflix.Notify.info(`Hooray! We found ${numberOfImages} images.`);
      }

      createImageCard(arrayOfImages);
      lightbox.refresh();
      loadMoreEl.classList.remove('is-hidden');
    })         
}

//  BUTTON
loadMoreEl.addEventListener('click', () => {
  page += 1;
  
  if (page > totalPage) {
    loadMoreEl.classList.add('is-hidden');
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    return;
  }
       
  requestImages(userRequestStorage, page)
    .then(response => {
      createImageCard(response.data.hits);
      lightbox.refresh();   
  })
          
});


function requestImages(userRequest, page) {
        console.log('userRequest= ', userRequest, 'page counter = ', page);
  return axios.get(`https://pixabay.com/api/?key=${KEY}&q=${userRequest}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`)
}


// CREATE MARK-UP RENDER
function createImageCard(arrayOfImages) {
  console.log(arrayOfImages);
  const setOfImages = arrayOfImages.map(element => {
    return`
      <div class="photo-card">
        <a class="gallery__item" href="${element.largeImageURL}"> 
          <img class="image" src="${element.webformatURL}" alt=${element.tags} loading="lazy" />
        </a>                             
        <div class="info">
          <p class="info-item">
            <b>Likes</b> <br>
            ${element.likes}                        
          </p>
          <p class="info-item">
            <b>Views</b> <br>
            ${element.views}
          </p>
          <p class="info-item">
            <b>Comments</b> <br> 
            ${element.comments}
          </p>
          <p class="info-item"> 
            <b>Downloads</b> <br>
            ${element.downloads}
          </p>
        </div>
      </div>`
  })

  setCardEl.insertAdjacentHTML('beforeend', setOfImages.join(''));   
}




















// requestImages(userRequest, page)
//  .then(data => {
//       console.log(data.status);
       
//     })
    // .catch(() => {
    //   Notiflix.Notify.failure('Oops, there is no country with that name');
    // });   



// ============================

// const axios = require('axios').default;

// const KEY = '30789164-35a7cf56b7677b8602e966f0f';


// async function getData() {
//   const searchQuery = 'dog';
//   const page = 1;
//   const config = {
//     responseType: 'json',
//     baseURL: 'https://pixabay.com/api',
//   };

//   const response = await axios.get(
//     `/?key=${KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`,
//     config
//   );

//  console.log(response);
//   return response;
// }

// getData();