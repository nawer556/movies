"""Optional maintenance script. Produce original, abstract SVG concept posters (not official art)."""
from pathlib import Path
from html import escape

OUT = Path(__file__).parent / 'assets' / 'posters'
OUT.mkdir(parents=True, exist_ok=True)

# Each work uses only abstract geometry. No original film stills or trademarks are embedded.
POSTERS = [
    ('interstellar', 'INTERSTELLAR', '2014', '#071b33', '#315a75', '#e8b47e', '''
        <circle cx="240" cy="272" r="148" fill="url(#light)" opacity=".18"/>
        <ellipse cx="240" cy="275" rx="198" ry="79" transform="rotate(-25 240 275)" fill="none" stroke="#e8b47e" stroke-width="2" opacity=".8"/>
        <circle cx="240" cy="260" r="114" fill="#071321" stroke="#8a9baa" stroke-opacity=".45" stroke-width="4"/>
        <path d="M126 258a114 114 0 0 1 228 0" stroke="#e8b47e" stroke-width="8" fill="none" stroke-opacity=".8"/>
        <circle cx="375" cy="82" r="3" fill="white"/><circle cx="93" cy="156" r="2" fill="white"/><circle cx="370" cy="410" r="2" fill="white"/>
        <path d="M80 475L385 75" stroke="white" stroke-opacity=".17"/>
    '''),
    ('inception', 'INCEPTION', '2010', '#171c36', '#485c88', '#d1a9e6', '''
        <g transform="translate(240 270)" stroke="#d1a9e6" fill="none" stroke-width="3">
          <rect x="-130" y="-130" width="260" height="260" transform="rotate(26)" opacity=".85"/>
          <rect x="-115" y="-115" width="230" height="230" transform="rotate(-12)" opacity=".7"/>
          <rect x="-85" y="-85" width="170" height="170" transform="rotate(40)" opacity=".7"/>
          <rect x="-53" y="-53" width="106" height="106" transform="rotate(8)" opacity=".8"/>
        </g>
        <path d="M35 450L240 255L445 450" fill="none" stroke="white" stroke-opacity=".2" stroke-width="2"/>
    '''),
    ('spirited-away', 'SPIRITED AWAY', '2001', '#13363b', '#5a6871', '#f1d19b', '''
        <path d="M70 477V175Q240 52 410 175V477" stroke="#efd3a2" stroke-width="7" fill="#133039" opacity=".8"/>
        <path d="M96 469V192Q240 92 384 192V469" stroke="#edbc89" stroke-opacity=".5" stroke-width="3" fill="none"/>
        <circle cx="240" cy="254" r="103" fill="#f1d19b" fill-opacity=".68"/>
        <path d="M135 410Q240 289 345 410" fill="none" stroke="#fff6d8" stroke-width="4" opacity=".6"/>
        <g fill="#f5cf9a"><circle cx="112" cy="150" r="8"/><circle cx="352" cy="163" r="8"/><circle cx="320" cy="95" r="5"/></g>
    '''),
    ('parasite', 'PARASITE', '2019', '#132a27', '#587566', '#dbe5cb', '''
        <rect x="70" y="124" width="340" height="316" rx="2" fill="#153f3a" stroke="#dbe5cb" stroke-opacity=".55" stroke-width="3"/>
        <rect x="98" y="148" width="134" height="120" fill="#86a292" opacity=".65"/>
        <rect x="248" y="148" width="134" height="120" fill="#253f3c"/>
        <rect x="98" y="283" width="284" height="135" fill="#0b2225"/>
        <path d="M98 350H382M240 149V418" stroke="#dbe5cb" stroke-opacity=".45" stroke-width="4"/>
        <path d="M55 450L425 82" stroke="#e9e6c1" stroke-opacity=".45" stroke-width="2"/>
        <circle cx="240" cy="346" r="43" fill="#e9e6c1" opacity=".12"/>
    '''),
    ('coco', 'COCO', '2017', '#30254f', '#d96d58', '#ffcf76', '''
        <circle cx="240" cy="260" r="130" fill="#ffae58" fill-opacity=".16" stroke="#ffcf76" stroke-opacity=".7" stroke-width="3"/>
        <circle cx="240" cy="260" r="90" fill="none" stroke="#ffb76d" stroke-width="25" stroke-dasharray="2 25"/>
        <circle cx="240" cy="260" r="43" fill="#ffcf76" fill-opacity=".85"/>
        <g fill="#ffc574" opacity=".82"><circle cx="79" cy="192" r="8"/><circle cx="398" cy="162" r="14"/><circle cx="120" cy="392" r="11"/><circle cx="377" cy="389" r="9"/><circle cx="302" cy="89" r="6"/></g>
        <path d="M80 455Q240 365 400 455" stroke="#ffe0ae" stroke-opacity=".6" stroke-width="3" fill="none"/>
    '''),
    ('the-dark-knight', 'THE DARK KNIGHT', '2008', '#071724', '#34475d', '#d8c78f', '''
        <circle cx="310" cy="188" r="112" fill="#d8c78f" opacity=".76"/>
        <rect x="45" y="335" width="70" height="150" fill="#0b1426"/><rect x="120" y="290" width="80" height="195" fill="#0b1426"/>
        <rect x="210" y="350" width="48" height="135" fill="#0b1426"/><rect x="268" y="258" width="82" height="227" fill="#0b1426"/>
        <rect x="357" y="327" width="85" height="158" fill="#0b1426"/>
        <g fill="#d8c78f" opacity=".45"><rect x="136" y="319" width="8" height="14"/><rect x="159" y="344" width="8" height="14"/><rect x="282" y="293" width="9" height="16"/><rect x="310" y="328" width="9" height="16"/><rect x="387" y="365" width="8" height="15"/></g>
        <path d="M28 445L446 226" stroke="#d8c78f" stroke-opacity=".5" stroke-width="2"/>
    '''),
    ('dune', 'DUNE', '2021', '#49312e', '#bc7951', '#f6d0a0', '''
        <circle cx="310" cy="185" r="132" fill="#f4d7a5" opacity=".77"/>
        <path d="M0 380Q185 225 480 351V515H0Z" fill="#6e4136" opacity=".9"/>
        <path d="M0 442Q180 320 480 380V520H0Z" fill="#ab6750"/>
        <path d="M0 496Q255 365 480 454V530H0Z" fill="#e2a06c"/>
        <path d="M-10 310Q180 255 380 305" stroke="#fff1c5" stroke-opacity=".28" stroke-width="4" fill="none"/>
        <path d="M65 200L130 200" stroke="#f6d0a0" stroke-width="3" opacity=".65"/>
    '''),
    ('about-time', 'ABOUT TIME', '2013', '#2c3553', '#bd7188', '#ffca99', '''
        <circle cx="235" cy="260" r="135" fill="none" stroke="#ffca99" stroke-width="5" opacity=".87"/>
        <circle cx="235" cy="260" r="107" fill="none" stroke="#f6c9b6" stroke-width="1.5" stroke-dasharray="3 12"/>
        <path d="M235 260V164M235 260L310 298" stroke="#ffca99" stroke-width="7" stroke-linecap="round"/>
        <circle cx="235" cy="260" r="11" fill="#ffca99"/>
        <path d="M70 460C110 380 160 400 210 457S350 420 411 460" stroke="#ffc1a4" stroke-opacity=".5" stroke-width="3" fill="none"/>
        <circle cx="380" cy="145" r="16" fill="#ffd9bb" fill-opacity=".4"/>
    '''),
    ('breaking-bad', 'BREAKING BAD', '2008', '#1a382d', '#558d6d', '#d6ed94', '''
        <path d="M150 160L240 108L330 160V265L240 316L150 265Z" stroke="#d6ed94" stroke-width="4" fill="#1a4c3a" opacity=".84"/>
        <path d="M150 315L240 263L330 315V420L240 472L150 420Z" stroke="#b0dc93" stroke-width="4" fill="none" opacity=".65"/>
        <circle cx="240" cy="212" r="38" fill="#d6ed94" opacity=".8"/>
        <g stroke="#b0dc93" stroke-width="3" opacity=".55"><path d="M120 146L70 110M352 287L412 246M142 449L90 488"/></g>
        <g fill="#d6ed94"><circle cx="70" cy="110" r="7"/><circle cx="412" cy="246" r="8"/><circle cx="90" cy="488" r="6"/></g>
    '''),
    ('stranger-things', 'STRANGER THINGS', '2016', '#261a3e', '#704668', '#e6a0a0', '''
        <circle cx="240" cy="257" r="124" fill="#bf6e83" fill-opacity=".16" stroke="#e6a0a0" stroke-width="3"/>
        <circle cx="240" cy="257" r="86" fill="none" stroke="#e6a0a0" stroke-opacity=".55" stroke-width="3"/>
        <circle cx="240" cy="257" r="45" fill="none" stroke="#e6a0a0" stroke-width="3"/>
        <path d="M0 485L190 315L240 395L290 315L480 485Z" fill="#130f28"/>
        <path d="M0 485H480M0 450H480M0 415H480M0 380H480" stroke="#e6a0a0" stroke-opacity=".37" stroke-width="2"/>
        <path d="M240 325V485M175 325L103 485M305 325L377 485" stroke="#e6a0a0" stroke-opacity=".38" stroke-width="2"/>
    '''),
]

for slug, label, year, color1, color2, accent, art in POSTERS:
    # 保守字寬設定：避免不同 SVG 渲染器不支援 textLength 而裁切片名。
    title_sizes = {
        'about-time': 59, 'breaking-bad': 47, 'coco': 75, 'dune': 75,
        'inception': 67, 'interstellar': 48, 'parasite': 73,
        'spirited-away': 47, 'stranger-things': 38, 'the-dark-knight': 39,
    }
    size = title_sizes[slug]
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 720" width="480" height="720" role="img" aria-label="{escape(label)} 原創抽象概念海報">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1"><stop stop-color="{color1}"/><stop offset="1" stop-color="{color2}"/></linearGradient>
        <radialGradient id="light"><stop stop-color="{accent}" stop-opacity=".8"/><stop offset="1" stop-color="{accent}" stop-opacity="0"/></radialGradient>
        <linearGradient id="fade" x1="0" x2="0" y1="0" y2="1"><stop stop-color="{color1}" stop-opacity="0"/><stop offset="1" stop-color="{color1}" stop-opacity="1"/></linearGradient>
      </defs>
      <rect width="480" height="720" fill="url(#bg)"/>
      <g>{art}</g>
      <rect x="0" y="445" width="480" height="275" fill="url(#fade)"/>
      <rect x="26" y="26" width="428" height="668" fill="none" stroke="{accent}" stroke-opacity=".37" stroke-width="2"/>
      <text x="45" y="67" fill="{accent}" font-family="Arial, sans-serif" font-size="13" letter-spacing="5" font-weight="700">CINELOG  /  SELECTS</text>
      <path d="M45 548H435" stroke="{accent}" opacity=".8" stroke-width="2"/>
      <text x="45" y="611" textLength="{min(390, max(130, len(label)*size*.63))}" lengthAdjust="spacingAndGlyphs" font-family="Arial, Helvetica, sans-serif" font-size="{size}" font-weight="800" fill="#ffffff">{escape(label)}</text>
      <text x="45" y="652" fill="{accent}" font-family="Arial, sans-serif" font-size="14" font-weight="700" letter-spacing="3">EDITORIAL CONCEPT</text>
      <text x="435" y="652" text-anchor="end" fill="#ffffff" font-family="Arial, sans-serif" font-size="15" letter-spacing="2">{year}</text>
    </svg>'''
    (OUT / f'{slug}.svg').write_text(svg, encoding='utf-8')
print(f'Generated {len(POSTERS)} original SVG concept posters in {OUT}')
