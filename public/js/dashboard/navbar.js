// Toggle menú móvil dashboard
const menuToggle = document.getElementById('dashboard-menu-toggle');
const menuMobile = document.getElementById('dashboard-mobile-menu');
const menuClose = document.getElementById('dashboard-menu-close');
if (menuToggle && menuMobile && menuClose) {
    menuToggle.addEventListener('click', () => menuMobile.classList.remove('hidden'));
    menuClose.addEventListener('click', () => menuMobile.classList.add('hidden'));
    menuMobile.addEventListener('click', (e) => { if (e.target === menuMobile) menuMobile.classList.add('hidden'); });
}
// Dropdown usuario
const userBtn = document.getElementById('userDropdownBtn');
const userMenu = document.getElementById('userDropdownMenu');

if (userBtn && userMenu) {
    userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (userMenu.classList.contains('hidden')) {
            userMenu.classList.remove('hidden');
            userMenu.classList.remove('opacity-0', 'pointer-events-none', 'scale-95');
            userMenu.classList.add('opacity-100', 'pointer-events-auto', 'scale-100', 'animate-dropdown-in');
            setTimeout(() => userMenu.classList.remove('animate-dropdown-in'), 250);
        } else {
            userMenu.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
            userMenu.classList.remove('opacity-100', 'pointer-events-auto', 'scale-100');
            setTimeout(() => userMenu.classList.add('hidden'), 200);
        }
    });
    document.addEventListener('click', (e) => {
        if (!userBtn.contains(e.target) && !userMenu.contains(e.target)) {
            userMenu.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
            userMenu.classList.remove('opacity-100', 'pointer-events-auto', 'scale-100');
            setTimeout(() => userMenu.classList.add('hidden'), 200);
        }
    });
}
// Sidebar colapsable
var sidebar = document.getElementById('dashboardSidebar');
var collapseBtn = document.getElementById('sidebarCollapseBtn');
var sidebarTitle = document.getElementById('sidebarTitle');
var sidebarLabels = document.querySelectorAll('.sidebar-label');
var collapsed = false;
if (collapseBtn && sidebar) {
    collapseBtn.addEventListener('click', () => {
        collapsed = !collapsed;
        if (collapsed) {
            sidebar.classList.remove('w-56');
            sidebar.classList.add('w-20');
            if (sidebarTitle) sidebarTitle.style.display = 'none';
            sidebarLabels.forEach(lbl => lbl.style.display = 'none');
            collapseBtn.innerHTML = '<i class="bi bi-chevron-right"></i>';
            collapseBtn.title = 'Expandir menú';
        } else {
            sidebar.classList.add('w-56');
            sidebar.classList.remove('w-20');
            if (sidebarTitle) sidebarTitle.style.display = '';
            sidebarLabels.forEach(lbl => lbl.style.display = '' );
            collapseBtn.innerHTML = '<i class="bi bi-chevron-left"></i>';
            collapseBtn.title = 'Colapsar menú';
        }
    });
}