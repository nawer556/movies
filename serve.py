"""使用 Python 標準函式庫啟動 CineLog，並自動開啟網頁。"""

from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import sys
import webbrowser


PROJECT_DIR = Path(__file__).resolve().parent


def main():
    handler = partial(SimpleHTTPRequestHandler, directory=str(PROJECT_DIR))
    server = None
    for port in range(8000, 8006):
        try:
            server = ThreadingHTTPServer(('127.0.0.1', port), handler)
            break
        except OSError:
            continue

    if server is None:
        print('啟動失敗：8000～8005 埠都被使用，請關閉其他本機伺服器再試。', file=sys.stderr)
        return 1

    with server:
        url = f'http://localhost:{server.server_port}/'
        print(f'CineLog 已啟動：{url}', flush=True)
        print('請保持此視窗開啟；按 Ctrl+C 可以停止網站。', flush=True)
        try:
            if not webbrowser.open_new_tab(url):
                print('瀏覽器未自動開啟，請複製以上網址到瀏覽器。', flush=True)
        except Exception:
            print('瀏覽器未自動開啟，請複製以上網址到瀏覽器。', flush=True)
        try:
            server.serve_forever(poll_interval=0.2)
        except KeyboardInterrupt:
            print('\n已停止網站。')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
