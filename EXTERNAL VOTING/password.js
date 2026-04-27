const bcrypt = require('bcryptjs');
const readline = require('readline');

// Create an interface to take input from the user via command line
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Ask the user for their password
rl.question('Enter your password to hash: ', (plainPassword) => {
    // Hash the password
    bcrypt.hash(plainPassword, 10, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
        } else {
            console.log('Hashed password:', hash);
            // Here you can save the hashed password to your database
        }
        rl.close(); // Close the input stream
    });
});
