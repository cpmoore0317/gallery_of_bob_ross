/*!
* Start Bootstrap - Scrolling Nav v5.0.6 (https://startbootstrap.com/template/scrolling-nav)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-scrolling-nav/blob/master/LICENSE)
*/
//
// Scripts
// 
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
const menuItems = document.querySelectorAll('.circle-menu .menu-item');

menuItems.forEach(item => {
  item.addEventListener('click', async () => {
    const seasonRange = item.getAttribute('data-season');
    const url = seasonRange
      ? `http://localhost:4000/episodes/sort-by-season?season=${seasonRange}`
      : `http://localhost:4000/episodes/sort-by-season`;

    Logger.info(`Fetching data from: ${url}`);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      Logger.log('Data received:');
      Logger.log(JSON.stringify(data));

      const results = document.getElementById('gallery');
      results.innerHTML = '';

      data.forEach(episode => {
        const card = document.createElement('div');
        card.classList.add('card', 'mb-4');

        const img = document.createElement('img');
        img.src = episode.image || './images/sample.png'; // Use a placeholder image if none available
        img.classList.add('card-img-top');
        img.alt = `Image for ${episode.title}`;

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const title = document.createElement('h5');
        title.classList.add('card-title');
        title.textContent = `Season ${episode.season}, Episode ${episode.episode} - ${episode.title}`;

        const description = document.createElement('p');
        description.classList.add('card-text');
        description.textContent = episode.description || 'No description available.';

        cardBody.appendChild(title);
        cardBody.appendChild(description);
        card.appendChild(img);
        card.appendChild(cardBody);
        results.appendChild(card);
      });
    } catch (error) {
      Logger.error(`Failed to fetch data: ${error.message}`);
    }
  });
});
