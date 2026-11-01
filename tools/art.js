/* Draws the career cartoons and writes docs/pattern.svg and docs/banner.svg.
   Run with: node tools/art.js */
const fs = require('fs'), path = require('path');
const DOCS = path.join(__dirname, '..', 'docs');

const INK = '#3b2f24', NAVY = '#23395b', RED = '#8c2f2f', GOLD = '#c9973f', GREEN = '#3f6b57', TEAL = '#3e7c86',
  CREAM = '#fffaf0', GREY = '#8a8378', ORANGE = '#c8703a', BROWN = '#7a5a3c', DARK = '#2b2b33';
const SKIN = ['#f2cfa6', '#d9a877', '#b98553', '#eab98c'];

const body = c => `<path d="M16 99C16 77 30 69 50 69S84 77 84 99Z" fill="${c}"/>`;
const face = (i = 0) => `<circle cx="50" cy="47" r="17" fill="${SKIN[i]}"/><circle cx="44" cy="46" r="1.8" fill="${INK}" stroke="none"/><circle cx="56" cy="46" r="1.8" fill="${INK}" stroke="none"/><path d="M44 54Q50 59 56 54" fill="none"/>`;
const hair = (c = DARK) => `<path d="M33 46C31 26 69 26 67 46C62 38 52 36 44 37C39 38 35 41 33 46Z" fill="${c}"/>`;
const tie = c => `<path d="M46 69L50 74L54 69ZM47.5 74L50 90L52.5 74Z" fill="${c}"/>`;
const collar = `<path d="M38 70L50 80L62 70L58 66H42Z" fill="${CREAM}"/>`;

const PEOPLE = {
  pilot: body(NAVY) + collar + tie(DARK) + face(0) + `<path d="M31 41C33 25 67 25 69 41Z" fill="${NAVY}"/><path d="M30 41H70L74 45C60 42 40 42 26 45Z" fill="${DARK}"/><circle cx="50" cy="34" r="3.5" fill="${GOLD}"/><path d="M58 80H72M61 84H69" stroke="${GOLD}" fill="none"/>`,
  insurance: body(DARK) + collar + tie(RED) + face(1) + hair() + `<path d="M72 62C78 64 84 64 90 62C91 76 87 84 81 88C75 84 71 76 72 62Z" fill="${GOLD}"/><path d="M76 74L80 78L86 69" fill="none" stroke-width="2.6"/>`,
  teacher: body(GREEN) + collar + face(3) + `<path d="M33 46C30 22 70 22 67 46C61 37 39 37 33 46Z" fill="${BROWN}"/><circle cx="50" cy="26" r="6" fill="${BROWN}"/><circle cx="44" cy="46" r="4.5" fill="none"/><circle cx="56" cy="46" r="4.5" fill="none"/><path d="M48.5 46H51.5" fill="none"/><path d="M66 74H94V94H66Z" fill="${DARK}"/><path d="M71 81H89M71 87H83" stroke="${CREAM}" fill="none"/>`,
  worker: body(ORANGE) + `<path d="M34 72L28 98M66 72L72 98" stroke="${GOLD}" stroke-width="5" fill="none"/><path d="M22 86H78" stroke="${CREAM}" stroke-width="3" fill="none"/>` + face(2) + `<path d="M31 42C31 20 69 20 69 42Z" fill="${GOLD}"/><path d="M27 42H73V46H27Z" fill="${GOLD}"/><path d="M50 25V41" fill="none"/>`,
  mechanic: body(TEAL) + `<path d="M36 70V99M64 70V99" fill="none"/>` + face(1) + `<path d="M33 42C33 27 67 27 67 42Z" fill="${RED}"/><path d="M33 42H74V45H33Z" fill="${RED}"/><path d="M72 96L88 68" stroke="${GREY}" stroke-width="6" fill="none"/><path d="M84 70C82 64 88 60 92 62L88 67L92 70L96 66C97 72 90 76 84 70Z" fill="${GREY}"/>`,
  architect: body(BROWN) + collar + face(0) + hair(BROWN) + `<circle cx="44" cy="46" r="4.5" fill="none"/><circle cx="56" cy="46" r="4.5" fill="none"/><path d="M48.5 46H51.5" fill="none"/><path d="M60 92L92 60" stroke="#3e6fa3" stroke-width="10" fill="none"/><path d="M60 92L92 60" stroke="${CREAM}" stroke-width="1.5" fill="none"/>`,
  doctor: body(CREAM) + `<path d="M50 70V99" fill="none"/><path d="M36 70C34 84 44 86 50 80C56 86 66 84 64 70" fill="none" stroke="${NAVY}"/><circle cx="50" cy="82" r="3" fill="${NAVY}"/>` + face(2) + hair() + `<path d="M33 37C40 29 60 29 67 37" fill="none" stroke="${GREY}"/><circle cx="50" cy="31" r="5" fill="${GOLD}"/>`,
  nurse: body(TEAL) + collar + face(3) + `<path d="M33 46C31 28 69 28 67 46C60 39 40 39 33 46Z" fill="${DARK}"/><path d="M36 33L40 21H60L64 33C56 30 44 30 36 33Z" fill="${CREAM}"/><path d="M50 22V29M46.5 25.5H53.5" stroke="${RED}" stroke-width="2.6" fill="none"/>`,
  chef: body(CREAM) + `<circle cx="44" cy="78" r="1.8" fill="${INK}" stroke="none"/><circle cx="56" cy="78" r="1.8" fill="${INK}" stroke="none"/><circle cx="44" cy="88" r="1.8" fill="${INK}" stroke="none"/><circle cx="56" cy="88" r="1.8" fill="${INK}" stroke="none"/><path d="M38 68H62L50 76Z" fill="${RED}"/>` + face(1) + `<path d="M34 38V28C24 22 32 8 42 13C46 3 58 3 60 13C70 8 76 22 66 28V38Z" fill="${CREAM}"/><path d="M34 34H66" fill="none"/>`,
  firefighter: body(GOLD) + `<path d="M20 86H80" stroke="${CREAM}" stroke-width="4" fill="none"/>` + face(0) + `<path d="M31 41C31 18 69 18 69 41Z" fill="${RED}"/><path d="M24 41C36 38 64 38 78 44L74 46C62 42 40 42 26 45Z" fill="${RED}"/><path d="M44 22H56L58 36L50 40L42 36Z" fill="${GOLD}"/>`,
  police: body(NAVY) + collar + tie(NAVY) + `<path d="M62 78L66 76L70 78L69 85L66 87L63 85Z" fill="${GOLD}"/>` + face(2) + `<path d="M28 34C36 22 64 22 72 34L68 41H32Z" fill="${NAVY}"/><path d="M31 41H69L72 45C60 42 40 42 28 45Z" fill="${DARK}"/><path d="M47 28H53V35H47Z" fill="${GOLD}"/>`,
  farmer: body(RED) + `<path d="M36 70V99M64 70V99" fill="none" stroke="${NAVY}" stroke-width="4"/>` + face(1) + `<path d="M34 40C34 22 66 22 66 40Z" fill="${GOLD}"/><path d="M18 42C32 36 68 36 82 42C68 48 32 48 18 42Z" fill="${GOLD}"/><path d="M34 37H66" stroke="${RED}" stroke-width="2.6" fill="none"/><path d="M84 98V62M84 72L78 66M84 72L90 66M84 64L78 58M84 64L90 58" fill="none" stroke="${GOLD}" stroke-width="2.6"/>`,
  scientist: body(CREAM) + `<path d="M50 70V99" fill="none"/>` + face(3) + `<path d="M33 42L27 32L37 34L38 24L46 30L52 22L56 30L65 25L64 34L73 33L67 43C60 34 40 34 33 42Z" fill="${GREY}"/><circle cx="44" cy="46" r="5.5" fill="#cfe0e0"/><circle cx="56" cy="46" r="5.5" fill="#cfe0e0"/><path d="M78 62H88M80 62V74L72 92H96L88 74V62" fill="${CREAM}"/><path d="M76 84H92L96 92H72Z" fill="${GREEN}"/>`,
  artist: body(TEAL) + `<path d="M40 68L50 78L60 68" fill="${CREAM}"/>` + face(0) + `<path d="M28 38C28 20 72 24 72 38C60 34 42 33 28 38Z" fill="${RED}"/><path d="M52 24L54 18" fill="none"/><path d="M68 76C68 64 94 64 94 78C94 84 88 82 86 86C84 92 68 90 68 76Z" fill="${BROWN}"/><circle cx="75" cy="74" r="2.4" fill="${RED}"/><circle cx="83" cy="72" r="2.4" fill="${GOLD}"/><circle cx="88" cy="78" r="2.4" fill="${TEAL}"/>`,
  musician: body(DARK) + `<path d="M50 72L42 68V76ZM50 72L58 68V76Z" fill="${RED}"/>` + face(2) + hair(BROWN) + `<path d="M74 92V64L90 60V86" fill="none" stroke-width="3"/><ellipse cx="70" cy="92" rx="5" ry="4" fill="${INK}"/><ellipse cx="86" cy="86" rx="5" ry="4" fill="${INK}"/>`,
  photographer: body(GREEN) + `<path d="M32 70L50 84L68 70" fill="none" stroke="${BROWN}" stroke-width="3"/>` + face(1) + hair() + `<path d="M32 80H68V97H32Z" fill="${DARK}"/><path d="M42 80L45 75H55L58 80Z" fill="${DARK}"/><circle cx="50" cy="88" r="6.5" fill="${TEAL}"/><circle cx="50" cy="88" r="2.5" fill="${CREAM}"/>`,
  lawyer: body(DARK) + `<path d="M43 68H57L54 84H46Z" fill="${CREAM}"/>` + face(3) + `<path d="M31 50C25 20 75 20 69 50C66 44 66 40 62 37C54 35 46 35 38 37C34 40 34 44 31 50Z" fill="${CREAM}"/><path d="M84 60V96M74 66H94M74 66L69 78H79ZM94 66L89 78H99Z" fill="none" stroke="${GOLD}" stroke-width="2.6"/>`,
  accountant: body(NAVY) + collar + tie(GOLD) + face(0) + hair() + `<path d="M30 40C40 34 60 34 70 40L78 45C60 39 40 39 30 42Z" fill="${GREEN}"/><path d="M68 68H94V98H68Z" fill="${GREY}"/><path d="M72 72H90V79H72Z" fill="${CREAM}"/><path d="M73 85H76M80 85H83M87 85H90M73 92H76M80 92H83M87 92H90" fill="none"/>`,
  astronaut: body('#d9d4c7') + `<path d="M40 82H60V93H40Z" fill="${RED}"/>` + `<circle cx="50" cy="44" r="27" fill="${CREAM}"/><circle cx="50" cy="45" r="20" fill="${NAVY}"/>` + `<circle cx="50" cy="47" r="15" fill="${SKIN[0]}"/><circle cx="45" cy="46" r="1.8" fill="${INK}" stroke="none"/><circle cx="55" cy="46" r="1.8" fill="${INK}" stroke="none"/><path d="M45 53Q50 57 55 53" fill="none"/><path d="M38 34Q44 28 52 29" stroke="${CREAM}" fill="none"/>`,
  sailor: body(CREAM) + `<path d="M34 70L50 86L66 70L58 66H42Z" fill="${NAVY}"/>` + face(2) + `<path d="M32 40C34 28 66 28 68 40Z" fill="${CREAM}"/><path d="M31 40H69V44H31Z" fill="${NAVY}"/><path d="M50 30V38M46 33H54M45 36C46 39 54 39 55 36" fill="none" stroke="${GOLD}" stroke-width="2"/>`,
  programmer: body(TEAL) + face(1) + hair() + `<path d="M33 46C31 18 69 18 67 46" fill="none" stroke="${DARK}" stroke-width="3"/><path d="M29 41H36V52H29ZM64 41H71V52H64Z" fill="${RED}"/><path d="M28 78H72L76 97H24Z" fill="${GREY}"/><path d="M45 86L41 89L45 92M55 86L59 89L55 92" fill="none" stroke="${CREAM}"/>`,
  journalist: body(ORANGE) + collar + face(3) + `<path d="M31 42C33 22 67 22 69 42Z" fill="${BROWN}"/><path d="M22 43H78V46H22Z" fill="${BROWN}"/><path d="M58 30H70V37H58Z" fill="${CREAM}"/><path d="M78 98L86 72" stroke="${DARK}" stroke-width="5" fill="none"/><circle cx="88" cy="66" r="7" fill="${GREY}"/>`,
  barber: body(CREAM) + `<path d="M36 70H64V99H36Z" fill="${RED}"/>` + face(0) + hair(BROWN) + `<path d="M78 64L90 92M92 64L80 92" fill="none" stroke="${GREY}" stroke-width="3"/><circle cx="77" cy="96" r="4" fill="none" stroke="${GOLD}"/><circle cx="93" cy="96" r="4" fill="none" stroke="${GOLD}"/>`,
  rider: body(GREEN) + `<path d="M64 72H96V98H64Z" fill="${GOLD}"/><path d="M64 84H96M80 72V98" fill="none" stroke="${BROWN}"/>` + face(2) + `<path d="M30 46C28 18 72 18 70 46C64 36 36 36 30 46Z" fill="${RED}"/><path d="M36 40H64" stroke="${CREAM}" stroke-width="3" fill="none"/>`
};

const NAMES = Object.keys(PEOPLE);
const SYMBOLS = NAMES.map(n => `<g id="${n}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">${PEOPLE[n]}</g>`).join('');

/* Wallpaper: six across, four down, every second row shifted half a cell. */
const CELL = 130, COLS = 6, ROWS = 4, W = CELL * COLS, H = CELL * ROWS, SIZE = 100;
const TILT = [-7, 5, -3, 8, -6, 3, 6, -8];
let placed = '', ornaments = '';
NAMES.forEach((n, i) => {
  const row = Math.floor(i / COLS), col = i % COLS, shift = row % 2 ? CELL / 2 : 0;
  const x = col * CELL + shift + (CELL - SIZE) / 2, y = row * CELL + (CELL - SIZE) / 2;
  const put = dx => `<use href="#${n}" transform="translate(${x + dx} ${y}) rotate(${TILT[i % TILT.length]} 50 50)"/>`;
  placed += put(0) + (x + SIZE + 20 > W ? put(-W) : '');
  const ox = col * CELL + shift, oy = row * CELL;
  ornaments += `<path d="M${ox} ${oy - 7}L${ox + 6} ${oy}L${ox} ${oy + 7}L${ox - 6} ${oy}Z" fill="${GOLD}"/>`;
});
fs.writeFileSync(path.join(DOCS, 'pattern.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${SYMBOLS}</defs><g opacity=".62">${ornaments}${placed}</g></svg>\n`);

/* Masthead strip for the welcome card. */
const crew = ['pilot', 'teacher', 'insurance', 'chef', 'worker', 'doctor', 'artist'];
const strip = crew.map((n, i) => `<use href="#${n}" transform="translate(${i * 92} 0)"/>`).join('');
fs.writeFileSync(path.join(DOCS, 'banner.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 652 100"><defs>${SYMBOLS}</defs>${strip}</svg>\n`);
console.log(NAMES.length + ' careers');
