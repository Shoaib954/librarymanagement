// Handle reminder and payment actions with AJAX
document.addEventListener('DOMContentLoaded', function() {
  // Handle reminder forms
  document.querySelectorAll('form[action*="/reminder/"]').forEach(form => {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      try {
        const response = await fetch(this.action, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const result = await response.json();
        
        if (result.success) {
          alert(result.message);
        } else {
          alert('Error: ' + result.error);
        }
      } catch (error) {
        alert('Error sending reminder');
      }
    });
  });
  
  // Handle mark paid forms
  document.querySelectorAll('form[action*="/mark-paid/"]').forEach(form => {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      if (!confirm('Mark fine as paid? This will return all overdue books.')) {
        return;
      }
      
      try {
        const response = await fetch(this.action, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const result = await response.json();
        
        if (result.success) {
          alert(result.message);
          location.reload(); // Refresh page to update display
        } else {
          alert('Error: ' + result.error);
        }
      } catch (error) {
        alert('Error marking as paid');
      }
    });
  });
});