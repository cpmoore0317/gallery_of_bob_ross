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
  const resultsPerPage = 10;

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
        setupPagination(data.totalPages, data.currentPage);
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

      const youtubeUrl = episode.youtube_src;
      const videoIdMatch = youtubeUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:embed\/|v\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      const videoId = videoIdMatch ? videoIdMatch[1] : null;
      const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : './images/sample.png';

      const link = document.createElement('a');
      link.href = youtubeUrl;
      link.target = '_blank';

      const img = document.createElement('img');
      img.src = thumbnailUrl;
      img.style.width = '100%';
      img.style.height = '255px';
      img.className = 'card-img-top';
      img.alt = episode.Episode_title;

      link.appendChild(img);
      card.appendChild(link);

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

// Click on menu item 1-5
document.getElementById('menu-item-1-5').addEventListener('click', function () {
  console.log('Menu item 1-5 clicked');
  const seasonStart = 1;
  const seasonEnd = 5;
  const page = 1;
  const limit = 10;
  const url = `http://localhost:4000/episodes/fields?seasonStart=${seasonStart}&seasonEnd=${seasonEnd}&page=${page}&limit=${limit}`;

  console.log('Fetching from URL:', url);

  // Fetch data from the server
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log('Episodes from Seasons 1-5:', data);
      renderEpisodes(data.episodes); // Update the UI with the new episodes
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
});

// Function to render episodes on the page (replacing old data)
document.getElementById('search-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevents the form from submitting and reloading the page

  const query = document.getElementById('search-input').value.trim();
  if (query === "") return; // Exit if the search query is empty

  fetch(`http://localhost:4000/episodes/search-by-title?title=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(data => {
          if (data.episode.length === 0) {
              document.getElementById('episodeList').innerHTML = `<p>No results found for "${query}".</p>`;
          } else {
              // Clear previous results
              document.getElementById('episodeList').innerHTML = '';
              document.getElementById('pagination').innerHTML = '';

              // Render new results
              data.episode.forEach(ep => {
                  const episodeElement = `
                      <div class="col-12 col-md-4">
                          <h3>${ep.Episode_title}</h3>
                          <p>Season: ${ep.Season}, Episode: ${ep.episode}</p>
                          <a href="${ep.youtube_src}" target="_blank">Watch on YouTube</a>
                      </div>
                  `;
                  document.getElementById('episodeList').insertAdjacentHTML('beforeend', episodeElement);
              });

              // Optionally handle pagination if necessary
              if (data.totalPages > 1) {
                  // Populate pagination controls
                  // Your pagination logic here...
              }
          }
      })
      .catch(error => console.error('Error fetching episode:', error));
});

// Function to extract YouTube ID from URL
function extractYouTubeId(url) {
  const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:embed\/|v\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return videoIdMatch ? videoIdMatch[1] : null;
}

// contact form
document.getElementById('feedback-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent default form submission

  const feedback = document.getElementById('feedback').value;

  // You might want to send this data to your server or process it accordingly
  // For demonstration purposes, we'll just log it and show a success message
  console.log('Feedback received:', feedback);

  // Display success message
  document.getElementById('feedback-response').innerHTML = `
      <div class="alert alert-success" role="alert">
          Thank you for your feedback! We appreciate your input.
      </div>
  `;

  // Clear the feedback field
  document.getElementById('feedback').value = '';
});
