/*!
* Start Bootstrap - Scrolling Nav v5.0.6 (https://startbootstrap.com/template/scrolling-nav)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-scrolling-nav/blob/master/LICENSE)
*/
//
// Scripts
// 
import logger from '../logger';
import Logger from '../logger';

window.addEventListener('DOMContentLoaded', event => {

  // Activate Bootstrap scrollspy on the main nav element
  const mainNav = document.body.querySelector('#mainNav');
  if (mainNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: '#mainNav',
      rootMargin: '0px 0px -40%',
    });
  };

  // Collapse responsive navbar when toggler is visible
  const navbarToggler = document.body.querySelector('.navbar-toggler');
  const responsiveNavItems = [].slice.call(
    document.querySelectorAll('#navbarResponsive .nav-link')
  );
  responsiveNavItems.map(function (responsiveNavItem) {
    responsiveNavItem.addEventListener('click', () => {
      if (window.getComputedStyle(navbarToggler).display !== 'none') {
        navbarToggler.click();
      }
    });
  });

});

document.querySelectorAll('.menu-item').forEach(item => {
  item.addEventListener('click', () => {
    const circleMenu = document.querySelector('.circle-menu');
    circleMenu.classList.add('spin');

    // Remove the 'spin' class after 2 seconds to stop the animation
    setTimeout(() => {
      circleMenu.classList.remove('spin');
    }, 2000);
  });
});

let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

// fetching data for circle menu items
// Select all menu items in the circle menu
// Example function to fetch data with logging
async function fetchPaintings(seasons) {
  try {
    console.log(`Requesting paintings for seasons: ${seasons.join(', ')}`);
    
    const response = await fetch(`/api/paintings?seasons=${seasons.join(',')}`);
    if (response.ok) {
      const data = await response.json();
      console.log(`Received ${data.length} paintings`);
      displayPaintings(data);
    } else {
      logger.info('Failed to fetch data');
    }
  } catch (error) {
    logger.info('Error fetching data:', error);
  }
}

// Function to display the fetched paintings
function displayPaintings(paintings) {
  // Clear previous content
  const cardContainer = document.querySelector('.row.justify-content-start.mt-4');
  cardContainer.innerHTML = ''; // Clear existing cards

  // Create and append new cards
  paintings.forEach(painting => {
    const cardHtml = `
      <div class="card mb-4">
        <img src="${painting.img_src}" class="card-img-top" alt="${painting.Episode_title}">
        <div class="card-body">
          <h5 class="card-title">${painting.Episode_title}</h5>
          <p class="card-text">Season: ${painting.Season} - Episode: ${painting.episode}</p>
          <a href="${painting.youtube_src}" class="btn btn-primary">Watch on YouTube</a>
        </div>
      </div>
    `;
    cardContainer.innerHTML += cardHtml;
  });
}

// Add event listeners to menu items
document.querySelectorAll('.circle-menu .menu-item').forEach(item => {
  item.addEventListener('click', function() {
    // Extract the seasons from the data attribute
    const seasonsRange = this.getAttribute('data-season');
    const seasonsArray = seasonsRange.split('-').map(num => num.trim());
    
    // Fetch data based on the selected seasons
    fetchPaintings(seasonsArray);
  });
});
