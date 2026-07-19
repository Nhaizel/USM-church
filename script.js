
// Sidebar functionality
function showSideBar() {
    const sideBar = document.querySelector(".sidebar");
    sideBar.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when sidebar is open
}

function hideSideBar() {
    const sideBar = document.querySelector(".sidebar");
    sideBar.style.display = 'none'; 
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

// Close sidebar when clicking on a link
document.addEventListener('DOMContentLoaded', function() {
    const sidebarLinks = document.querySelectorAll('.sidebar a[href^="#"]');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            hideSideBar();
        });
    });
    
    // Close sidebar when clicking outside
    const sidebar = document.querySelector('.sidebar');
    document.addEventListener('click', function(event) {
        const menuBtn = document.querySelector('.menu-btn');
        if (sidebar.style.display === 'flex' && 
            !sidebar.contains(event.target) && 
            !menuBtn.contains(event.target)) {
            hideSideBar();
        }
    });
});