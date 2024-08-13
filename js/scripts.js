/*!
* Start Bootstrap - Scrolling Nav v5.0.6 (https://startbootstrap.com/template/scrolling-nav)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-scrolling-nav/blob/master/LICENSE)
*/
//
// Scripts
// 

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

  // Handle episode form submission
  document.getElementById('episodeForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get values from form
    const season = document.getElementById('season').value;
    const episode = document.getElementById('episode').value;

    // Fetch data from the backend
    fetch(`http://localhost:4000/episodes/${season}/${episode}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
          return;
        }

        // Update UI with episode details
        document.getElementById('episodeTitle').textContent = data.TITLE || 'N/A';
        document.getElementById('episodeSeason').textContent = data.season || 'N/A';
        document.getElementById('episodeNumber').textContent = data.episode || 'N/A';
        document.getElementById('episodeAirDate').textContent = data.air_date || 'N/A';
        document.getElementById('episodeYouTube').href = data.youtube_src || '#';
        document.getElementById('episodeYouTube').textContent = data.youtube_src ? 'Watch' : 'N/A';
        document.getElementById('episodeImage').src = data.img_link || '';
        document.getElementById('episodeResult').classList.remove('d-none');
      })
      .catch(error => {
        console.error('Error fetching episode data:', error);
        alert('Failed to fetch episode data.');
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
