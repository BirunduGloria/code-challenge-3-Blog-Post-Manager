# Blog Post Manager

A dynamic front-end application that allows users to view, create, edit, and delete blog posts. Features include authentication (login/register), token-based authorization, and conditional UI rendering based on login state and post ownership.

#  Project Structure

blog-post-manager/
│
├── index.html
├── css/
│   └── styles.css
├── src/
│   └── index.js
├── db.json
└── README.md

## Features

- View all posts
- View post details
- Create a new post (authenticated users only)
- Edit and delete posts (only by post owner)
- User registration and login
- Logout functionality
- Token-based authentication 


## Tech Stack

- HTML
- CSS
- JavaScript
- JSON Server
- Fetch API


### Setup Instructions

1. Clone the Repository

2. Install JSON server(if not already)

3.Start JSON server

4.Open index.html in the browser to interact with the application.


# Authentication Flow
Users can register with a username and password.

Upon login, a JSON Web token is saved to localStorage.

All protected routes (create, edit, delete) require this token in the Authorization header.

UI changes based on whether the user is logged in.

# License
This project is for educational purposes only and not intended for production use.

