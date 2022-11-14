import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
// import axios from 'axios';
// = The above string was switched off because
// the library Axios uses in the module requestImages.js.
// If Axios uses in this file (not in the module),
// the string " import axios from 'axios'; " is nesessary.

import requestImages from './requestImages';

let lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

// const KEY = '30789164-35a7cf56b7677b8602e966f0f'; // It was replaced to the module requestImages.js

let totalImageNumber;
let page = 1;
let userRequest = '';
let userRequestStorage;
let totalPage;

const formEl = document.querySelector('#search-form');
const setCardEl = document.querySelector('.gallery');
const loadMoreEl = document.querySelector('.load-more');

loadMoreEl.classList.add('is-hidden');

formEl.addEventListener('submit', onSubmit);

async function onSubmit(event) {
  event.preventDefault();
  loadMoreEl.classList.add('is-hidden');
  
  try {
    page = 1;
    userRequest = event.currentTarget.searchQuery.value.trim();
  
    setCardEl.innerHTML = '';
    userRequestStorage = userRequest;
 
    const response = await requestImages(userRequestStorage, page);
    const arrayOfImages = response.data.hits;
    const numberOfImages = response.data.totalHits;

    totalImageNumber = response.data.totalHits;

    if (arrayOfImages.length === 0) {
      return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    };
    if (page === 1) {
      Notiflix.Notify.success(`Hooray! We found ${numberOfImages} images.`);
    };

    createImageCard(arrayOfImages);
    lightbox.refresh();
    
    if (totalImageNumber <= 40) {
      return notifyAboutEndOfCards();
    };
    loadMoreEl.classList.remove('is-hidden');

    // Block for smoothing scrolling - START   
    const { height: cardHeight } = document
      .querySelector(".gallery")
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * -100,
      behavior: "smooth",
    });
    // Block for smoothing scrolling - END

  } catch (error) {
    console.log(error.message);
  };
};


//  BUTTON "Load More"
loadMoreEl.addEventListener('click', onLoadBtnClick);

async function onLoadBtnClick() {
  page += 1;
         
  const response = await requestImages(userRequestStorage, page);
  createImageCard(response.data.hits);
  lightbox.refresh();   

  totalPage = Math.ceil(totalImageNumber / 40);
   
  if (page >= totalPage) {
    loadMoreEl.classList.add('is-hidden');
    notifyAboutEndOfCards();
    return;
  }
};

// async function requestImages(userRequest, page) {
//   const response = await axios.get(`https://pixabay.com/api/?key=${KEY}&q=${userRequest}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`);
//   return response;
// } // THIS FUNCTION WAS REPLACE TO THE MODUL requestImages.js


// CREATE MARK-UP RENDER
function createImageCard(arrayOfImages) {
  const setOfImages = arrayOfImages.map(element => {
    return `
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
  });

  setCardEl.insertAdjacentHTML('beforeend', setOfImages.join(''));   
};

function notifyAboutEndOfCards() {
  Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
};