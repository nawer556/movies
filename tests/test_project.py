"""使用 Python 標準函式庫驗證 AGENTS.md 的重要資料與結構規範。"""
import json
import math
import re
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REQUIRED_FIELDS = {
    'id': str, 'title': str, 'originalTitle': str, 'type': str,
    'year': int, 'genres': list, 'synopsis': str,
    'recommendation': str, 'score': (float, int), 'poster': str,
}


class CineLogProjectTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.movies = json.loads((ROOT / 'data/movies.json').read_text(encoding='utf-8'))

    def test_required_project_files(self):
        paths = ['AGENTS.md', 'README.md', 'index.html', 'movie.html',
                 'css/style.css', 'js/app.js', 'js/movie.js',
                 'js/favorites.js', 'js/startup.js', 'serve.py',
                 'start-site.bat', 'data/movies.json']
        for item in paths:
            with self.subTest(path=item):
                self.assertTrue((ROOT / item).is_file(), f'缺少檔案：{item}')

    def test_movie_schema_and_unique_ids(self):
        self.assertIsInstance(self.movies, list)
        seen_ids = set()
        for movie in self.movies:
            with self.subTest(movie=movie.get('id')):
                self.assertIsInstance(movie, dict)
                for field, expected_type in REQUIRED_FIELDS.items():
                    self.assertIn(field, movie)
                    self.assertIsInstance(movie[field], expected_type)
                self.assertRegex(movie['id'], r'^[a-z0-9]+(?:-[a-z0-9]+)*$')
                self.assertNotIn(movie['id'], seen_ids)
                seen_ids.add(movie['id'])
                self.assertIn(movie['type'], ('movie', 'series'))
                self.assertTrue(1888 <= movie['year'] <= 2100)
                self.assertTrue(movie['genres'])
                self.assertTrue(all(isinstance(genre, str) and genre.strip()
                                    for genre in movie['genres']))
                self.assertTrue(all(movie[field].strip() for field in
                                    ['title', 'originalTitle', 'synopsis', 'recommendation']))
                self.assertTrue(math.isfinite(movie['score']) and 1 <= movie['score'] <= 5)
                self.assertNotIsInstance(movie['score'], bool)

    def test_local_posters_and_valid_svg(self):
        for movie in self.movies:
            with self.subTest(movie=movie['id']):
                poster = movie['poster']
                if not poster:
                    continue  # 空字串由網站的 CSS 文字海報處理
                self.assertRegex(poster, r'^assets/posters/[a-z0-9-]+\.(svg|png|jpe?g|webp)$')
                path = ROOT / poster
                self.assertTrue(path.is_file(), f'找不到海報：{poster}')
                if path.suffix == '.svg':
                    ET.parse(path)

    def test_one_shared_detail_template(self):
        self.assertEqual(sorted(p.name for p in ROOT.glob('*.html')),
                         ['index.html', 'movie.html'])
        detail_script = (ROOT / 'js/movie.js').read_text(encoding='utf-8')
        self.assertIn('URLSearchParams', detail_script)
        self.assertIn('loadMovies', detail_script)

    def test_shared_design_and_responsive_rules(self):
        css = (ROOT / 'css/style.css').read_text(encoding='utf-8').lower()
        for token in ['#0b1020', '#171f33', '#f5c451',
                      '@media', 'prefers-reduced-motion', 'focus-visible']:
            with self.subTest(token=token):
                self.assertIn(token, css)


    def test_local_startup_support(self):
        """可從 Windows 啟動，不讓 file:// 頁面永久停在載入畫面。"""
        startup = (ROOT / 'js/startup.js').read_text(encoding='utf-8')
        self.assertIn("location.protocol === 'file:'", startup)
        self.assertIn("'aria-busy'", startup)
        self.assertIn('start-site.bat', startup)
        for filename in ['index.html', 'movie.html']:
            html = (ROOT / filename).read_text(encoding='utf-8')
            self.assertIn('./js/startup.js', html)
        batch = (ROOT / 'start-site.bat').read_text(encoding='utf-8')
        self.assertIn('serve.py', batch)



if __name__ == '__main__':
    unittest.main()
