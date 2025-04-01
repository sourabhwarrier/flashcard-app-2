# Flashcard App V2

Flashcard App V2 is a web-based application developed as the final project for the Modern Application Development II course at IITM DSA in March 2022. This application enables users to create, manage, and review flashcards to enhance their learning experience.

## Features

- **User Authentication**: Secure user registration and login functionality.
- **Flashcard Management**: Create, edit, delete, and organize flashcards into categories.
- **Review System**: Schedule and review flashcards based on a spaced repetition algorithm.
- **Progress Tracking**: Monitor learning progress with statistics and performance metrics.
- **Notifications**: Email reminders for scheduled reviews using SMTP.
- **Asynchronous Tasks**: Background processing with Celery and Redis for handling tasks like email notifications.

## Technologies Used

- **Backend**:
  - [Flask](https://flask.palletsprojects.com/): Lightweight WSGI web application framework.
  - [Flask-RESTful](https://flask-restful.readthedocs.io/): Extension for building REST APIs.
  - [SQLite3](https://www.sqlite.org/index.html): Relational database management system.
  - [Celery](https://docs.celeryq.dev/en/stable/): Asynchronous task queue/job queue.
  - [Redis](https://redis.io/): In-memory data structure store used as a message broker for Celery.

- **Frontend**:
  - [Vue.js](https://vuejs.org/): Progressive JavaScript framework for building user interfaces.
  - [Bootstrap 5](https://getbootstrap.com/): CSS framework for responsive and mobile-first front-end development.

- **Others**:
  - [smtplib](https://docs.python.org/3/library/smtplib.html): Python library for sending emails using the Simple Mail Transfer Protocol.

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/sourabhwarrier/flashcard-app-2.git
   cd flashcard-app-2

2. **Create a Virtual Environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt

4. **Set Up Environment Variables**:

   Create a .env file in the project root directory and define the necessary environment variables, such as database URI, email server settings, and secret keys.

6. **Start Application**:
    ```bash
   source start.sh

## API Dcoumentation

  For detailed information about the API endpoints, request/response formats, and usage examples, refer to the APIDOC.txt file included in the repository.

## Project Structure
    flashcard-app-2/
    ├── api/                # API endpoints and resources
    ├── application/        # Application configurations and initialization
    ├── celery_async/       # Celery task definitions
    ├── db/                 # Database models and migrations
    ├── static/             # Static files (CSS, JavaScript, images)
    ├── templates/          # HTML templates
    ├── app.py              # Main application entry point
    ├── requirements.txt    # Python dependencies
    ├── start.sh            # Shell script to start the application
    └── stop.sh             # Shell script to stop the application

## License
  This project is licensed under the MIT License. See the LICENSE file for more details.

## Acknowledgments
  - **Creator** : @sourabhwarrier
  - **Course** : Modern Application Development II, IITM DSA
  - **Date** : March 2022
  

