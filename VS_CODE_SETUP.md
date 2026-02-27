# VS Code Setup Guide for voiceBank

## 🚀 Quick Start in VS Code

### 1. Open Project in VS Code
1. Open VS Code
2. File → Open Folder → Select `online_banking` folder
3. VS Code will detect the Python project automatically

### 2. Install Required Extensions
Recommended VS Code extensions:
- **Python** (Microsoft) - Python language support
- **Flask Snippets** - Flask development helpers
- **Prettier** - Code formatting
- **Live Server** - Optional for frontend testing

### 3. Setup Python Environment
1. Open terminal in VS Code (Ctrl+` or Terminal → New Terminal)
2. Create virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate virtual environment:
   ```bash
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

### 5. Run the Application
1. In VS Code terminal:
   ```bash
   python app.py
   ```
2. The server will start on `http://localhost:5000`
3. Click the URL in terminal or manually navigate to the address

### 6. Debug Configuration (Optional)
Create `.vscode/launch.json` for debugging:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python: Flask",
            "type": "python",
            "request": "launch",
            "program": "${workspaceFolder}/app.py",
            "console": "integratedTerminal",
            "env": {
                "FLASK_APP": "app.py",
                "FLASK_ENV": "development"
            }
        }
    ]
}
```

### 7. Testing in VS Code
1. **Start Server**: Run `python app.py` in terminal
2. **Open Browser**: Ctrl+Click the localhost link
3. **Test Voice Commands**: Click microphone and speak
4. **View Logs**: Check terminal for server logs
5. **Debug**: Set breakpoints in `app.py` and use F5 to debug

### 8. Development Workflow
1. **Edit Code**: Modify `app.py` or `templates/index.html`
2. **Auto-reload**: Flask development server restarts automatically
3. **Test Changes**: Refresh browser to see updates
4. **Voice Testing**: Use browser's microphone permissions

### 9. Troubleshooting in VS Code
**Common Issues:**
- **Import errors**: Ensure virtual environment is activated
- **Port conflicts**: Change port in `app.py` if 5000 is busy
- **Microphone access**: Check browser permissions in VS Code's integrated browser
- **Python path**: Use Command Palette (Ctrl+Shift+P) → "Python: Select Interpreter"

### 10. Project Structure in VS Code
```
online_banking/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── README.md          # Documentation
├── templates/         # HTML templates
│   └── index.html     # Main interface
└── .vscode/          # VS Code configuration (optional)
    └── launch.json    # Debug configuration
```

### 11. Keyboard Shortcuts
- **Ctrl+F5**: Run without debugging
- **F5**: Start debugging
- **Ctrl+`**: Toggle terminal
- **Ctrl+Shift+P**: Command palette
- **Ctrl+Shift+V**: Open preview for README

### 12. Live Development Tips
- Use **Live Server** extension for frontend development
- Enable **Auto Save** in VS Code settings
- Use **Python extension** for linting and IntelliSense
- Check **Problems** panel for code issues

Happy coding! 🎉