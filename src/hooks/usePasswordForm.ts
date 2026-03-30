import { useState } from 'react'
import { JP_PASSWORD_CHARS, JP_SCRAMBLE_CODES, NA_PASSWORD_CHARS, NA_SCRAMBLE_CODES, POKEMON_LIST } from '../lib/data'
import type { Region, Category } from '../lib/data'

export function usePasswordForm() {
  const [password, setPassword] = useState('')
  const [region, setRegion] = useState<Region>('na')
  const [category, setCategory] = useState<Category>('pokemon')
  const [flag, setFlag] = useState(0)
  const [pokemon, setPokemon] = useState(POKEMON_LIST[0])

  const encode = () => {
    let passwd: Password = new Password(region, category, flag, pokemon);
    setPassword(passwd.encode());
  }

  const decode = () => {
    // TODO: implement decoding logic
  }

  return {
    password, setPassword,
    region, setRegion,
    category, setCategory,
    flag, setFlag,
    pokemon, setPokemon,
    encode,
    decode,
  }
}

export class Password {
  private _region: Region;
  private _category: Category;
  private _flag: number;
  private _pokemon: string;
  private _scramblePattern: number;

  /** Creates a new Password structure. If scramblePattern is not provided, or is specified as -1, a random value between 0 and 31 inclusive will be used. */
  constructor(region: Region = 'na', category: Category = 'pokemon', flag: number = 0, pokemon: string = "Eevee", scramblePattern: number = -1) {
    this._region = region;
    this._category = category;
    this._flag = (flag >= 0 && flag <= 63 ? flag : 0);
    this._pokemon = (POKEMON_LIST.indexOf(pokemon) != -1 ? pokemon : "Eevee");
    this._scramblePattern = (scramblePattern != -1 && scramblePattern <= 31 && scramblePattern >= 0 ? scramblePattern : Math.round(Math.random() * 31));
    console.log(`Password structure created with region: ${this._region}, category: ${this._category}, flag: ${this._flag}, pokemon: ${this._pokemon}, scramblePattern: ${this._scramblePattern}`);
  }

  // #region Getters
  public get region(): Region {
    return this._region;
  }

  public get category(): Category {
    return this._category;
  }

  public get flag(): number {
    return this._flag;
  }

  public get pokemon(): string {
    return this._pokemon;
  }

  public get scramblePattern(): number {
    return this._scramblePattern;
  }
  // #endregion

  // #region Setters
  public set region(v: Region) {
    this._region = v;
  }

  public set category(v: Category) {
    this._category = v;
  }

  public set flag(v: number) {
    if (v > (this._category === "event" ? 4 : 63) || v < 0) {
      throw new Error(`${this._category} passwords are constrained to 0-${this._category === "event" ? 4 : 63}`)
    }
    this._flag = v;
  }

  public set pokemon(v: string) {
    if (this._category === "event") {
      throw new Error("Pokemon data is not used in event passwords.");
    }
    this._pokemon = v;
  }

  /** The scramble pattern must be a number between 0 and 31.  If set to a value outside this range, it will instead be set to value modulo 31. */
  public set scramblePattern(v: number) {
    this._scramblePattern = (v > 31 || v < 0 ? v % 31 : v);
  }
  // #endregion

  public encode(): string {
    // First we construct the raw bytes containing the password data
    let rawBytes: number[] = [];
    rawBytes[0] = (this._category === 'pokemon' ? 0 : 1);
    rawBytes[1] = this._flag;
    rawBytes[2] = this._scramblePattern;
    rawBytes[3] = rawBytes[2] + 1;
    rawBytes[4] = rawBytes[2] + 2;
    rawBytes[5] = POKEMON_LIST.indexOf(this._pokemon);

    console.log(`Raw bytes: ${rawBytes.map(b => b.toString(16).padStart(2, '0')).join(' ')}`);

    // Second we calculate the secondary checksum of the raw bytes
    let checksum = rawBytes[5];
    for (let i = 0; i < 5; i++) {
      checksum += rawBytes[i] & 0x3f;
    }
    console.log(`Sum of raw bytes: ${checksum.toString(16).padStart(2, '0')}`);
    checksum = checksum & 0x3ff;

    console.log(`Secondary Checksum: ${checksum.toString(16).padStart(2, '0')}`);

    // Third we embed the checksum back into the raw bytes
    for (let i = 0; i < 6; i++) {
      rawBytes[i] |= ((checksum >> (i * 2)) & 3) << 6;
    }
    console.log(`Raw bytes with checksum: ${rawBytes.map(b => b.toString(16).padStart(2, '0')).join(' ')}`);

    // Fourth we apply the scramble pattern
    let scrambleCode = (this._region === 'na' ? NA_SCRAMBLE_CODES : JP_SCRAMBLE_CODES)[this._scramblePattern].toString(16).padStart(6, '0').split('').map(Number);
    console.log(`Scramble code: ${scrambleCode.map(n => n.toString(16)).join('')}`);

    let shuffledBytes: number[] = [];
    for (let i = 0; i < 6; i++) {
      shuffledBytes[scrambleCode[i]] = rawBytes[i] ^ i;
    }
    console.log(`Shuffled bytes: ${shuffledBytes.map(b => b.toString(16).padStart(2, '0')).join(' ')}`);

    // Fifth we convert the shuffled bytes into the final password string
    let passBytes: number[] = [];
    if (this._region === 'na') {
      passBytes[0] = shuffledBytes[0] % 0x39;
      passBytes[3] = Math.floor(shuffledBytes[0] / 0x39);

      passBytes[1] = shuffledBytes[1] % 0x39;
      passBytes[3] |= Math.floor(shuffledBytes[1] / 0x39) << 3;

      passBytes[2] = shuffledBytes[2] % 0x39;
      passBytes[4] = Math.floor(shuffledBytes[2] / 0x39);

      passBytes[5] = shuffledBytes[3] % 0x39;
      passBytes[8] = Math.floor(shuffledBytes[3] / 0x39);

      passBytes[6] = shuffledBytes[4] % 0x39;
      passBytes[8] |= Math.floor(shuffledBytes[4] / 0x39) << 3;

      passBytes[7] = shuffledBytes[5] % 0x39;
      passBytes[9] = Math.floor(shuffledBytes[5] / 0x39);
    } else {
      // JP: 3 bytes → 4 chars per group, base-66
      // Group 1 (bytes 0-2)
      passBytes[0] = shuffledBytes[0] % 0x42;
      passBytes[1] = shuffledBytes[1] % 0x42;
      passBytes[2] = shuffledBytes[2] % 0x42;
      passBytes[3] = Math.floor(shuffledBytes[0] / 0x42) | (Math.floor(shuffledBytes[1] / 0x42) << 2) | (Math.floor(shuffledBytes[2] / 0x42) << 4);

      // Group 2 (bytes 3-5)
      passBytes[4] = shuffledBytes[3] % 0x42;
      passBytes[5] = shuffledBytes[4] % 0x42;
      passBytes[6] = shuffledBytes[5] % 0x42;
      passBytes[7] = Math.floor(shuffledBytes[3] / 0x42) | (Math.floor(shuffledBytes[4] / 0x42) << 2) | (Math.floor(shuffledBytes[5] / 0x42) << 4);
    }

    if (this._region === 'na') {
      // Sixth we calculate the primary checksum and store it (NA only).
      let mesh = (shuffledBytes[0] & 0xf) | (shuffledBytes[1] & 0xf) << 4;
      checksum = Math.floor(mesh / 0x39);

      passBytes[4] |= (checksum & 0x7) << 3;
      console.log(`Group 1 - Primary Checksum: ${checksum.toString(16).padStart(2, '0')}`);

      mesh = (shuffledBytes[3] & 0xf) | (shuffledBytes[4] & 0xf) << 4;
      checksum = Math.floor(mesh / 0x39);

      passBytes[9] |= (checksum & 0x7) << 3;
      console.log(`Group 2 - Primary Checksum: ${checksum.toString(16).padStart(2, '0')}`);
    }

    // Finally we convert the password data into characters.
    const charSet = this._region === 'na' ? NA_PASSWORD_CHARS : JP_PASSWORD_CHARS;
    let password: string = '';
    for (let i = 0; i < passBytes.length; i++) {
      password += charSet[passBytes[i]];
    }
    console.log(`Final password: ${password}`);
    return password;
  }
}