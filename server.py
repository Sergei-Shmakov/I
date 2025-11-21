#!/usr/bin/env python3
"""
Простой HTTP сервер для запуска веб-игры "Путешествие по сознанию"
"""
import http.server
import socketserver
import webbrowser
import os
from pathlib import Path

PORT = 8000
DIRECTORY = "."

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def main():
    print("Запуск сервера для веб-игры 'Путешествие по сознанию'...")
    print(f"Сервер запущен на порту {PORT}")
    print(f"Откройте в браузере: http://localhost:{PORT}")
    print("Для остановки сервера нажмите Ctrl+C")
    
    # Открываем браузер с главной страницей
    webbrowser.open(f"http://localhost:{PORT}/index.html")
    
    # Запускаем сервер
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nСервер остановлен.")

if __name__ == "__main__":
    main()