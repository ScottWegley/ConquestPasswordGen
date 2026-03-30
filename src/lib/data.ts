/**
 * List of Pokemon available in the game.
 */
export const POKEMON_LIST = [
  "Eevee", "Vaporeon", "Jolteon", "Flareon", "Espeon", "Umbreon", "Leafeon", "Glaceon", "Ralts", "Kirlia", "Gardevoir", "Gallade", "Magikarp", "Gyarados", "Pichu", "Pikachu", "Raichu", "Wooper", "Quagsire", "Igglybuff", "Jigglypuff", "Wigglytuff", "Zubat", "Golbat", "Crobat", "Starly", "Staravia", "Staraptor", "Bidoof", "Bibarel", "Venipede", "Whirlipede", "Scolipede", "Shinx", "Luxio", "Luxray", "Litwick", "Lampent", "Chandelure", "Roggenrola", "Boldore", "Gigalith", "Petilil", "Lilligant", "Mareep", "Flaaffy", "Ampharos", "Cottonee", "Whimsicott", "Riolu", "Lucario", "Chingling", "Chimecho", "Ekans", "Arbok", "Pineco", "Forretress", "Meowth", "Persian", "Spheal", "Sealeo", "Walrein", "Gothita", "Gothorita", "Gothitelle", "Sandile", "Krokorok", "Krookodile", "Duskull", "Dusclops", "Dusknoir", "Munna", "Musharna", "Blitzle", "Zebstrika", "Dratini", "Dragonair", "Dragonite", "Larvitar", "Pupitar", "Tyranitar", "Beldum", "Metang", "Metagross", "Gible", "Gabite", "Garchomp", "Croagunk", "Toxicroak", "Deino", "Zweilous", "Hydreigon", "Snorunt", "Glalie", "Froslass", "Minccino", "Cinccino", "Machop", "Machoke", "Machamp", "Timburr", "Gurdurr", "Conkeldurr", "Cubchoo", "Beartic", "Oshawott", "Dewott", "Samurott", "Charmander", "Charmeleon", "Charizard", "Gastly", "Haunter", "Gengar", "Chimchar", "Monferno", "Infernape", "Snivy", "Servine", "Serperior", "Tepig", "Pignite", "Emboar", "Sewaddle", "Swadloon", "Leavanny", "Abra", "Kadabra", "Alakazam", "Treecko", "Grovyle", "Sceptile", "Piplup", "Prinplup", "Empoleon", "Pansage", "Simisage", "Pansear", "Simisear", "Panpour", "Simipour", "Darumaka", "Darmanitan", "Axew", "Fraxure", "Haxorus", "Joltik", "Galvantula", "Aron", "Lairon", "Aggron", "Drilbur", "Excadrill", "Zorua", "Zoroark", "Skorupi", "Drapion", "Pawniard", "Bisharp", "Rhyhorn", "Rhydon", "Rhyperior", "Shieldon", "Bastiodon", "Scraggy", "Scrafty", "Drifloon", "Drifblim", "Rufflet", "Braviary", "Anorith", "Armaldo", "Larvesta", "Volcarona", "Onix", "Steelix", "Beedrill", "Munchlax", "Snorlax", "Emolga", "Sneasel", "Weavile", "Misdreavus", "Mismagius", "Audino", "Carnivine", "Spiritomb", "Scyther", "Scizor", "Lapras", "Terrakion", "Articuno", "Registeel", "Groudon", "Dialga", "Mewtwo", "Reshiram", "Zekrom", "Arceus", "Rayquaza"
];

/**
 * List of in-game events
 */
export const EVENT_LIST = [
  "Keiji's Story",
  "Hideyoshi and Reshiram",
  "Motonari and Motochika",
  "Okuni's Story",
  "Ranmaru's Story"
];
/** Type representing the region of the game associated with the password. */
export type Region = 'na' | 'jp';
/** Type representing the category of the password, either Event or Pokemon. */
export type Category = 'pokemon' | 'event';
/** Type containing the characters used in NA Passwords. */
export const NA_PASSWORD_CHARS = "RJ8XB2cCmkZnDVqExFgGHraK3LwMN1ApW5iPUQzuS4TtvYb6de9fhjsy7".split('');
/** Type containing the characters used in JP Passwords. */
export const JP_PASSWORD_CHARS = "カイドタホ０トハミロオ２キセテナフヘマルメリレビエゼボクネガズサウヒノ６ニチ４ダケゴグバデコモヨ７ギ１ゲ９ヲ３ザ５ヤラブゾム８アヂベ".split('');

export const NUMBER_CHARS = ["0０Oo", "1１Il|", "2２", "3３", "4４", "5５", "6６", "7７", "8８", "9９"];
export const JP_SIMILAR_CHARS = ["アァｧｱ", "イィｨｲ", "ウゥｩｳ", "エェｪｴ", "オォｫｵ", "ヤャｬﾔ", "ヨョｮﾖ", "カヵｶ", "キｷ", "クｸ", "ケヶｹ", "コｺ", "サｻ", "セｾ", "タﾀ", "チﾁ", "テﾃ", "トﾄ", "ナﾅ", "ニﾆ", "ネﾈ", "ノﾉ", "ハﾊ", "ヒﾋと", "フﾌ", "ヘﾍへ", "ホﾎ", "マﾏ", "ミﾐ", "ムﾑ", "メﾒ", "モﾓ", "ラﾗ", "リﾘり", "ルﾙ", "レﾚ", "ロﾛ", "ヲｦ"];

export const NA_SCRAMBLE_CODES: number[] = [
  0x012453, 0x302541, 0x352041, 0x342501, 0x542301, 0x132540,
  0x512403, 0x142530, 0x032451, 0x102435, 0x142350, 0x402531,
  0x402351, 0x542103, 0x052143, 0x312054, 0x342015, 0x402315,
  0x432150, 0x412530, 0x312405, 0x312540, 0x142503, 0x352041,
  0x432051, 0x352014, 0x152043, 0x412503, 0x102543, 0x302415,
  0x032451, 0x012354,
];

export const JP_SCRAMBLE_CODES: number[] = [0x302154, 0x142053, 0x342501, 0x452310, 0x542310, 0x452301, 0x132045, 0x452301, 0x512403, 0x142305, 0x142503, 0x302415, 0x312504, 0x142503, 0x432105, 0x532041, 0x352410, 0x012543, 0x012345, 0x042135, 0x542013, 0x302514, 0x142503, 0x052431, 0x142305, 0x412035, 0x452310, 0x512304, 0x042513, 0x152340, 0x132540, 0x302415];

export const DISALLOWED_POKEMON: number[] = [0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x0A, 0x0B, 0x10, 0x15, 0x26, 0x29, 0x40, 0x46, 0x4C, 0x4D, 0x53, 0x56, 0x5B, 0x5E, 0x63, 0x66, 0x6A, 0x6B, 0x6D, 0x6E, 0x71, 0x73, 0x74, 0x76, 0x77, 0x79, 0x7A, 0x80, 0x82, 0x83, 0x85, 0x86, 0x88, 0x8A, 0x8C, 0x91, 0x96, 0xA1, 0xAB, 0xAD, 0xAF, 0xB2, 0xB7, 0xBA, 0xBC, 0xBE, 0xBF, 0xC0, 0xC1, 0xC2, 0xC3, 0xC4, 0xC5, 0xC6, 0xC7];
