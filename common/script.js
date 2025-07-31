function loadCommonElements() {
    // Load sidebar
    fetch('common/sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar-placeholder').innerHTML = data;
            setupMenu();
        });
    
    // Load header
    fetch('common/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        });
}

function setupMenu() {
    // Menu toggle functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Collapsible menu functionality
    const categories = document.querySelectorAll('.menu-category');
    categories.forEach(category => {
        category.addEventListener('click', function() {
            this.classList.toggle('collapsed');
            const ul = this.nextElementSibling;
            ul.classList.toggle('collapsed');
        });
    });
    
    // Set active menu item
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.parentElement.classList.add('active');
            // Expand the parent category
            const category = link.closest('ul').previousElementSibling;
            category.classList.remove('collapsed');
            link.closest('ul').classList.remove('collapsed');
        }
    });
}

// Call when page loads
document.addEventListener('DOMContentLoaded', loadCommonElements);
