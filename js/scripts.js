// Lightweight JS for basic interactivity

document.addEventListener("DOMContentLoaded", () => {
  console.log("IE Calculators site loaded");

  // Example: smooth scrolling for anchor links
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Example: optional AdSense placeholder warning
  const adSections = document.querySelectorAll("#adsense-top, #adsense-bottom");
  adSections.forEach(ad => {
    ad.addEventListener("click", () => {
      alert("This is a placeholder for your AdSense ad.");
    });
  });
});
