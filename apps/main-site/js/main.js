// Main site JavaScript
// Add active state to current nav link
document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll(".nav-links a");
  links.forEach(function (link) {
    const href = link.getAttribute("href");
    if (href && (currentPath === href || currentPath.startsWith(href + "/"))) {
      link.classList.add("nav-link--active");
    }
  });
});
