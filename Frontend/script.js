// Function to toggle(switch) the visibility of the navbar when the hamburger menu is clicked
function toggleNavbar() {
  const navbarLinks = document.querySelector('nav');
  const hamburger = document.querySelector('.hamburger');
  navbarLinks.classList.toggle('active');  
 hamburger.classList.toggle('active');    
}

const hamburgerIcon = document.querySelector('.hamburger');
hamburgerIcon.addEventListener('click', toggleNavbar);