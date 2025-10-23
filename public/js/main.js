// Dashboard statistics
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('totalBooks')) {
    loadDashboardStats();
  }
});

async function loadDashboardStats() {
  try {
    const response = await fetch('/api/stats');
    const stats = await response.json();
    
    document.getElementById('totalBooks').textContent = stats.totalBooks || 0;
    document.getElementById('totalMembers').textContent = stats.totalMembers || 0;
    document.getElementById('activeIssues').textContent = stats.activeIssues || 0;
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}