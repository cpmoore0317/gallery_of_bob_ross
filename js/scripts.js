/*!
* Start Bootstrap - Scrolling Nav v5.0.6 (https://startbootstrap.com/template/scrolling-nav)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-scrolling-nav/blob/master/LICENSE)
*/
//
// Scripts
// clear
// const logger = require('../logger');


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

//FETCH FROM SERVER
window.addEventListener('DOMContentLoaded', function () {
  const episodeList = document.getElementById('episodeList');
  let currentPage = 1;
  const resultsPerPage = 5;

  // Function to fetch episodes from the server
  function fetchEpisodes(page) {
    const url = `http://localhost:4000/episodes/fields?page=${page}&limit=${resultsPerPage}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.error('Error fetching data:', data.error);
          return;
        }
        console.log('Data', data);
        populateEpisodes(data.episodes);
        setupPagination(data.totalPages, data.currentPage); // Ensure you use `currentPage` in setupPagination
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }
  // Function to populate the episodes in the UI
  function populateEpisodes(episodes) {
    episodeList.innerHTML = ''; // Clear previous results

    episodes.forEach(episode => {
      const card = document.createElement('div');
      card.className = 'card mb-4';

      const img = document.createElement('img');
      img.src = episode.youtube_src || './images/sample.png'; // Replace with actual image URL if available
      img.style = 'width:30%; height: 275px;';
      img.className = 'card-img-top';
      img.alt = episode.Episode_title;

      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';

      const cardTitle = document.createElement('h5');
      cardTitle.className = 'card-title';
      cardTitle.textContent = episode.Episode_title;

      const cardText = document.createElement('p');
      cardText.className = 'card-text';
      cardText.textContent = `Season: ${episode.Season}, Episode: ${episode.episode}`;

      cardBody.appendChild(cardTitle);
      cardBody.appendChild(cardText);
      card.appendChild(img);
      card.appendChild(cardBody);

      episodeList.appendChild(card);
    });
  }

  // Function to set up pagination (if needed)
  function setupPagination(totalPages, currentPage) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = ''; // Clear previous pagination

    for (let i = 1; i <= totalPages; i++) {
      const pageLink = document.createElement('button');
      pageLink.textContent = i;
      pageLink.className = 'page-link';
      if (i === currentPage) {
        pageLink.classList.add('active');
      }

      pageLink.addEventListener('click', function () {
        fetchEpisodes(i); // Fetch episodes for the selected page
      });

      pagination.appendChild(pageLink);
    }
  }

  // Automatically fetch data on page load
  fetchEpisodes(currentPage);
});


