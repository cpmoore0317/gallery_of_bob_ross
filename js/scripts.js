/*!
* Start Bootstrap - Scrolling Nav v5.0.6 (https://startbootstrap.com/template/scrolling-nav)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-scrolling-nav/blob/master/LICENSE)
*/
//
// Scripts
// clear
const logger = require('../logger');


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
document.querySelectorAll('.menu-item').forEach(item => {
  item.addEventListener('click', async () => {
      const circleMenu = document.querySelector('.circle-menu');
      circleMenu.classList.add('spin');

      // Get the data attribute or some identifier from the clicked item
      const season = item.getAttribute('data-season');
      logger.info(`Menu item clicked: Fetching data for season ${season}`);

      try {
          const response = await fetch(`http://localhost:4000/episodes?season=${season}`);
          logger.info(`Received response for season ${season}`);

          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          logger.info(`Data for season ${season} successfully parsed as JSON`);

          // Update the UI with the fetched data
          const episodeList = document.getElementById('episodeList');
          episodeList.innerHTML = ''; // Clear previous list items

          data.forEach(episode => {
              const listItem = document.createElement('li');
              listItem.innerHTML = `
                  <strong>${episode.Episode_title}</strong><br>
                  <a href="${episode.youtube_src}" target="_blank">Watch on YouTube</a>
              `;
              episodeList.appendChild(listItem);
              logger.info(`Episode "${episode.Episode_title}" added to the list for season ${season}.`);
          });
      } catch (error) {
          logger.error(`Failed to fetch data for season ${season}:`, error.message);
      }

      // Remove the 'spin' class after 2 seconds to stop the animation
      setTimeout(() => {
          circleMenu.classList.remove('spin');
      }, 2000);
  });
});

