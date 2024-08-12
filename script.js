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
  