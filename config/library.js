// Library configuration settings
module.exports = {
  loanPeriods: {
    'Fiction': 14,        // 2 weeks
    'Non-Fiction': 21,    // 3 weeks
    'Science': 28,        // 4 weeks
    'Technology': 28,     // 4 weeks
    'History': 21,        // 3 weeks
    'default': 14         // Default 2 weeks
  },
  finePerDay: 5,          // $5 per day overdue
  maxRenewalDays: 7       // Can renew 7 days before due date
};