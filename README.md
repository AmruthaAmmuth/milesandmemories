<p align="center">
  <img src="./img.png" alt="Project Banner" width="100%">
</p>

# [Project Name] 🎯

## Basic Details

### Team Name: [SPARK HER]

### Team Members
- Member 1: [Amrutha Manoj] - [College of Engineering, Attingal]
- Member 2: [MUFEENA F] - [College of Engineering, Attingal]

### Hosted Project Link
[https://milesandmemories.vercel.app/](https://milesandmemories.vercel.app/)

### Project Description
[A private digital journal for hearts that stay connected, miles apart. It’s a shared space where couples can write entries, upload photos, and create a timeline of their journey together, ensuring memories never fade.]

### The Problem statement
Long-distance relationships often lack a shared, private space for consistent, small signals of care and shared digital experiences, making emotional distance feel larger.

### The Solution
[Miles & Memories bridges this gap by providing a secure, shared digital space where couples can document their journey together. Through private journaling, photo sharing, and milestone tracking, the platform helps couples stay connected, cherish memories, and look forward to their future together, regardless of the distance.]

---

## Technical Details

### Technologies/Components Used

**For Software:**
- Languages used: Python, JavaScript, HTML, CSS
- Frameworks used: Flask
- Libraries used: SQLAlchemy, Flask-SQLAlchemy, Flask-Cors, Flask-JWT-Extended, SQLite
- Tools used: VS Code, Git

---

## Features

List the key features of your project:
- Shared Diary: Write and share daily thoughts with your partner.
- Memory Gallery: Upload and categorize precious photos into a shared collage.
- Event Countdown: Track upcoming visits or special occasions together.
- Spontaneous Messages: Send quick signals of care to let them know you're thinking of them.
- Couple Linking: Unique "Couple Codes" to securely link accounts and share data.

---

## Implementation

### For Software:

#### Installation
```bash
# Clone the repository
git clone [repository-url]
cd milesandmemories

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r requirements.txt
```

#### Run
```bash
python app.py
```

#### Render Deployment (Backend)
1. **Build Command:** `pip install -r requirements.txt`
2. **Start Command:** `gunicorn app:app`
3. **Persistent Database (CRITICAL):**
   - In Render, click **"New"** -> **"PostgreSQL"**.
   - Create the database and wait for it to be available.
   - Go to your Web Service (Backend) -> **"Environment"**.
   - Click **"Add Environment Variable"**.
   - Key: `DATABASE_URL`, Value: Select your Postgres database from the dropdown (or paste the "Internal Database URL").
   - Click **"Add Environment Variable"**.
   - Key: `PYTHON_VERSION`, Value: `3.14.3` (matching your logs).

---

## Project Documentation

---

### Documentation

#### Screenshots (Add at least 3)

![Screenshot1](Add screenshot 1 here with proper name)
*Add caption explaining what this shows*

![Screenshot2](Add screenshot 2 here with proper name)
*Add caption explaining what this shows*

![Screenshot3](Add screenshot 3 here with proper name)
*Add caption explaining what this shows*

#### Diagrams

**System Architecture:**

![Architecture Diagram](docs/architecture.png)
*The app uses a Flask backend with a SQLite database, serving a responsive HTML/JS/CSS frontend. JWT is used for secure authentication.*

**Application Workflow:**

![Workflow](docs/workflow.png)
*Add caption explaining your workflow*

---

### For Hardware:

#### Schematic & Circuit

![Circuit](Add your circuit diagram here)
*Add caption explaining connections*

![Schematic](Add your schematic diagram here)
*Add caption explaining the schematic*

#### Build Photos

![Team](Add photo of your team here)

![Components](Add photo of your components here)
*List out all components shown*

![Build](Add photos of build process here)
*Explain the build steps*

![Final](Add photo of final product here)
*Explain the final build*

---

## Additional Documentation

### For Web Projects with Backend:

#### API Documentation

**Base URL:** `https://milesandmemories-0st4.onrender.com`

##### Endpoints

**POST /api/auth/register**
- **Description:** Register a new user.
- **Request Body:** `{ "name": "...", "email": "...", "password": "..." }`
- **Response:** `{ "message": "User registered successfully" }`

**POST /api/auth/login**
- **Description:** Authenticate user and receive JWT.
- **Request Body:** `{ "email": "...", "password": "..." }`
- **Response:** `{ "access_token": "...", "user": { ... } }`

**GET /api/diary**
- **Description:** Fetch shared diary entries.
- **Response:** `[ { "id": 1, "text": "...", "date": "..." }, ... ]`

**POST /api/memories**
- **Description:** Upload a new memory (image).
- **Request Body (Multipart):** `file`, `category`
- **Response:** `{ "message": "Memory uploaded" }`

**GET /api/events**
- **Description:** List upcoming events.
- **Response:** `[ { "title": "...", "date": "..." }, ... ]`

---

## Project Demo

### Video
[Add your demo video link here - YouTube, Google Drive, etc.]

*Explain what the video demonstrates - key features, user flow, technical highlights*

### Additional Demos
[Add any extra demo materials/links - Live site, APK download, online demo, etc.]

---

## AI Tools Used (Optional - For Transparency Bonus)

If you used AI tools during development, document them here for transparency:

**Tool Used:** [e.g., GitHub Copilot, v0.dev, Cursor, ChatGPT, Claude]

**Purpose:** [What you used it for]
- Example: "Generated boilerplate React components"
- Example: "Debugging assistance for async functions"
- Example: "Code review and optimization suggestions"

**Key Prompts Used:**
- "Create a REST API endpoint for user authentication"
- "Debug this async function that's causing race conditions"
- "Optimize this database query for better performance"

**Percentage of AI-generated code:** [Approximately X%]

**Human Contributions:**
- Architecture design and planning
- Custom business logic implementation
- Integration and testing
- UI/UX design decisions

*Note: Proper documentation of AI usage demonstrates transparency and earns bonus points in evaluation!*

---

## Team Contributions

- [Name 1]: [Specific contributions - e.g., Frontend development, API integration, etc.]
- [Name 2]: [Specific contributions - e.g., Backend development, Database design, etc.]
- [Name 3]: [Specific contributions - e.g., UI/UX design, Testing, Documentation, etc.]

---

## License

This project is licensed under the [LICENSE_NAME] License - see the [LICENSE](LICENSE) file for details.

**Common License Options:**
- MIT License (Permissive, widely used)
- Apache 2.0 (Permissive with patent grant)
- GPL v3 (Copyleft, requires derivative works to be open source)

---

Made with ❤️ at TinkerHub CEAL
