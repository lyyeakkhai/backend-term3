// server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    console.log(`Received ${method} request for ${url}`);

    if (url === '/' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end('Welcome to the Home Page');
    }

    if (url === '/contact' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <form method="POST" action="/contact">
            <input type="text" name="name" placeholder="Your name" />
            <button type="submit">Submit</button>
          </form>
        `);
        return;
    }

    if (url === '/contact' && method === 'POST') {
        let body = '';

        // Capture the form data
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            // Log raw body to console
            console.log('Raw form data:', body);

            // Parse URL-encoded form data manually
            // Example: name=John+Doe
            const params = new URLSearchParams(body);
            const name = params.get('name');

            if (name) {
                console.log('Submitted name:', name);

                // Write it to a local file named submissions.txt
                const filePath = path.join(__dirname, 'submissions.txt');
                fs.appendFile(filePath, name + '\n', err => {
                    if (err) {
                        console.error('Error writing to file:', err);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        return res.end('Internal Server Error');
                    }

                    // Send a success response
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end('<h1>Success!</h1><p>Thank you, ' + name + '. Your submission has been recorded.</p><a href="/contact">Back to contact</a>');
                });
            } else {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Bad Request: Missing name field');
            }
        });
        return;
    }

    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('404 Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});
