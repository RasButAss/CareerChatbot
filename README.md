# Career Chatbot
## Backend setup
1. Create python environment:
   ```
   cd backend
   python3 -m venv chatbot
   source ./chatbot/bin/activate
   ```
2. Run the commands below:
   ```
   pip install requirements.txt
   ```
3. Run mistral on Ollama:
   ```
   ollama run mistral
   ```
4. Run fastapi server:
   ```
   fastapi run main.py
   ```
## Frontend setup
1. Run the commands below:
   ```
   cd frontend
   npm install
   ```
2. Start the vite app:
   ```
   npm run dev
   ```
