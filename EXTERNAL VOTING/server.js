const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');

// Import the voting.js functions (e.g., castVote)
//const { castVote } = require('./public/js/voting');

const app = express();
const PORT = 3001;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (like CSS)
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'your_secret_key', // Change to a secure key for production
    resave: false,
    saveUninitialized: true,
}));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'YOUR_DATABASE_USERNAME', // Replace with your database username
    password: 'YOUR_DATABASE_PASSWORD', // Replace with your database password
    database: 'YOUR_DATABASE_NAME' // Replace with your database name
});

// Connect to the database
db.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected');
});

// Route for the root page (Home)
app.get('/', (req, res) => {
    if (req.session.userId) {
        return res.redirect('/dashboard'); // Redirect to dashboard if authenticated
    }
    res.render('login'); // Render login page if not authenticated
});

// Login Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if username or email exists
    const query = 'SELECT * FROM voters WHERE username = ? OR email = ?';
    db.query(query, [username, username], (err, results) => {
        if (err) {
            console.error('Error during login query:', err);
            return res.status(500).send('Server error');
        }

        if (results.length > 0) {
            const user = results[0];

            // Compare password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.error('Error comparing password:', err);
                    return res.status(500).send('Server error');
                }

                if (isMatch) {
                    req.session.userId = user.id; // Save user id in session
                    return res.redirect('/dashboard'); // Redirect to dashboard
                } else {
                    return res.status(401).send('Invalid password'); // Invalid password
                }
            });

        } else {
            return res.status(404).send('User not found'); // User not found
        }
    });
});

// Route for register page
app.get('/register', (req, res) => {
    res.render('register');  // Renders register.ejs
});
// Route for the dashboard page
app.get('/dashboard', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/'); // Redirect to login if not authenticated
    }

    // Fetch user data from the database using userId from the session
    const query = 'SELECT username FROM voters WHERE id = ?';
    db.query(query, [req.session.userId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Server error');
        }

        if (results.length > 0) {
            const user = results[0];
            res.render('dashboard', { user }); // Render dashboard with user data
        } else {
            return res.status(404).send('User not found');
        }
    });
});

// Route for the profile page
app.get('/profile', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/'); // Redirect to login if not authenticated
    }

    // Fetch user details from the database using the userId stored in the session
    const query = 'SELECT username, email, voter_id FROM voters WHERE id = ?';
    db.query(query, [req.session.userId], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Server error');
        }

        if (results.length > 0) {
            const user = results[0];
            res.render('profile', { user }); // Render the profile page with user data
        } else {
            return res.status(404).send('User not found');
        }
    });
});

// Route for the offline centers page
app.get('/offline-centers', (req, res) => {
    res.render('offline-centers'); // Render offline centers without fetching data
});

// Route for the participants page
app.get('/participants', (req, res) => {
    res.render('participants'); // Renders participants.ejs
});

// Route for the voting page
app.get('/vote', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/'); // Redirect to login if not authenticated
    }

    // Fetch participants from the database to display in the voting form
    const query = 'SELECT * FROM participants'; // Use your actual participants table
    db.query(query, (err, participants) => {
        if (err) {
            console.error('Error fetching participants:', err);
            return res.status(500).send('Server error');
        }

        res.render('vote', { participants }); // Pass participants to the vote.ejs
    });
});

app.get('/forgot-password', (req, res) => {
    res.render('forgot-password'); // Render forgot-password.ejs
});

// POST route for casting a vote
app.post('/vote', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/'); // Redirect to login if not authenticated
    }

    const { participantId } = req.body; // The participant ID selected by the user

    try {
        const receipt = await castVote(participantId); // Call castVote from voting.js
        console.log('Vote successfully cast:', receipt);
        res.send('Vote successfully cast!');
    } catch (error) {
        console.error('Failed to cast vote:', error.message);
        res.status(500).send('Failed to cast vote, please try again.');
    }
});

// Route for the Help and Support page
app.get('/help-and-support', (req, res) => {
    res.render('help-and-support'); // Render the help-and-support.ejs page
});

// Route for Voting Instructions Page
app.get('/voting-instructions', (req, res) => {
    res.render('voting-instructions'); // Render voting-instructions.ejs
});


// Route to handle the form submission for Help and Support
app.post('/submit-support', (req, res) => {
    const { name, email, message } = req.body;

    // Process the submitted data as needed
    console.log(`Support Request Received: 
      Name: ${name}, 
      Email: ${email}, 
      Message: ${message}`);

    // After processing, redirect back to the Help and Support page
    res.redirect('/help-and-support'); // Redirect back to the help and support page
});

// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/dashboard');
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.redirect('/'); // Redirect to login
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
