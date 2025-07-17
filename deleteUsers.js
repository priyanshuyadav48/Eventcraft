const axios = require('axios');

// Replace with your actual admin token
const ADMIN_TOKEN = 'YOUR_ADMIN_TOKEN_HERE';

// Users to delete (emails)
const usersToDelete = [
  'pranav@example.com',
  'pranav22csu134@ncuindia.edu',
  'gg@example.com'
];

async function deleteUsers() {
  try {
    const response = await axios.delete('http://localhost:5000/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: {
        emails: usersToDelete
      }
    });
    
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

deleteUsers();
