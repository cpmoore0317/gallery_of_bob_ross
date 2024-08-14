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

// FETCH FROM SERVER
window.addEventListener('DOMContentLoaded', function () {
  const episodeList = document.getElementById('episodeList');
  const pagination = document.getElementById('pagination');
  let currentPage = 1;
  const episodesPerPage = 10;

  // Function to fetch episodes from the server
  // Function to fetch episodes from the server
  function fetchEpisodes(page, seasonStart = null, seasonEnd = null, query = null) {
    let url = `http://localhost:4000/episodes/fields?page=${page}&limit=${episodesPerPage}`;

    if (seasonStart && seasonEnd) {
      url += `&seasonStart=${seasonStart}&seasonEnd=${seasonEnd}`;
    }

    if (query) {
      url = `http://localhost:4000/episodes/search-by-title?title=${encodeURIComponent(query)}`;
      console.log("Fetching with URL:", url); // Log the URL for debugging
    }

    fetch(url)
      .then(response => {
        console.log('Response status:', response.status); // Log status code
        if (!response.ok) {
          // Handle HTTP errors
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Data received:', data); // Log data
        if (data.error || (data.episode && !Array.isArray(data.episode))) {
          console.error('Error fetching data:', data.error || 'Unexpected data format');
          return;
        }
        if (query) {
          populateEpisodes(data.episode, query); // Use 'episode' from the response
        } else {
          if (Array.isArray(data.episodes)) {
            populateEpisodes(data.episodes); // Populate episodes for paginated results
            setupPagination(data.totalPages, data.currentPage);
          } else {
            console.error('Expected "episodes" to be an array but got:', data.episodes);
          }
        }
      })
      .catch(error => {
        console.error('Fetch error:', error); // Log any fetch errors
      });
  }

  // Function to populate the episodes in the UI
  function populateEpisodes(episodes, query = null) {
    episodeList.innerHTML = ''; // Clear previous episodes

    // Check if 'episodes' is an array
    if (!Array.isArray(episodes)) {
      console.error('Expected episodes to be an array but got:', episodes);
      return;
    }

    if (episodes.length === 0) {
      episodeList.innerHTML = '<p>No episodes found.</p>'; // Display message if no episodes are found
      return;
    }

    episodes.forEach(episode => {
      if (query && episode.Episode_title.toLowerCase() !== query.toLowerCase()) {
        return; // Skip episodes that don't match the search query
      }

      const card = document.createElement('div');
      card.className = 'card mb-4';

      const youtubeUrl = episode.youtube_src;
      const videoId = extractYouTubeId(youtubeUrl);
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

    // Clear pagination if we're searching by title
    if (query) {
      pagination.innerHTML = '';
    }
  }

  // Function to set up pagination (if needed)
  function setupPagination(totalPages, currentPage) {
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

  // Handle search form submission
  document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevents the form from submitting and reloading the page

    const query = document.getElementById('search-input').value.trim();
    if (query === "") return; // Exit if the search query is empty

    console.log('Search query:', query); // Log the search query

    try {
      fetchEpisodes(1, null, null, query); // Fetch episodes based on search query
    } catch (error) {
      console.error('Error during fetch:', error); // Log any errors that occur
    }
  });

  function fetchEpisodes(page, seasonStart = null, seasonEnd = null, query = null) {
    const resultsPerPage = 12; // or any other value you need

    let url = `http://localhost:4000/episodes/fields?page=${page}&limit=${resultsPerPage}`;

    if (seasonStart && seasonEnd) {
      url += `&seasonStart=${seasonStart}&seasonEnd=${seasonEnd}`;
    }

    if (query) {
      url = `http://localhost:4000/episodes/search-by-title?title=${encodeURIComponent(query)}`;
    }

    console.log('Fetching with URL:', url); // Log the URL

    fetch(url)
      .then(response => {
        console.log('Response status:', response.status); // Log status code
        if (!response.ok) {
          // Handle HTTP errors
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Data received:', data); // Log data
        if (data.error || (data.episode && !Array.isArray(data.episode))) {
          console.error('Error fetching data:', data.error || 'Unexpected data format');
          return;
        }
        if (query) {
          populateEpisodes(data.episode, query); // Use 'episode' from the response
        } else {
          populateEpisodes(data.episodes); // Assuming 'episodes' for paginated results
          setupPagination(data.totalPages, data.currentPage);
        }
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  }

  // Function to extract YouTube ID from URL
  function extractYouTubeId(url) {
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:embed\/|v\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return videoIdMatch ? videoIdMatch[1] : null;
  }
});


// contact form
document.getElementById('feedback-form').addEventListener('submit', function (event) {
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
