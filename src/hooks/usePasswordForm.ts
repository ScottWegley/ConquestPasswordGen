import { useState } from 'react'
import { POKEMON_LIST } from '../lib/data'
import type { Region, Category } from '../lib/data'

export function usePasswordForm() {
  const [password, setPassword] = useState('')
  const [region, setRegion] = useState<Region>('na')
  const [category, setCategory] = useState<Category>('pokemon')
  const [flag, setFlag] = useState(0)
  const [pokemon, setPokemon] = useState(POKEMON_LIST[0])

  const encode = () => {
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

  constructor(region: Region = 'na', category: Category = 'pokemon', flag: number = 0, pokemon: string = "Eevee", scramblePattern: number = -1) {
    this._region = region;
    this._category = category;
    this._flag = (flag >= 0 && flag <= 63 ? flag : 0);
    this._pokemon = (POKEMON_LIST.indexOf(pokemon) != -1 ? pokemon : "Eevee");
    this._scramblePattern = (scramblePattern == -1 ? scramblePattern : Math.random() * 31);
  }

  public get region() : Region {
    return this._region;
  }

  public get category() : Category {
    return this._category;
  }
  
  public get flag() : number {
    return this._flag;
  }
  
  public get pokemon() : string {
    return this._pokemon;
  }
  
  public get scramblePattern() : number {
    return this._scramblePattern;
  }

  public set region(v : Region) {
    this._region = v;
  }

  public set category(v : Category) {
    this._category = v;
  }
  
  public set flag(v : number) {
    if(v > (this._category === "event" ? 4 : 63) || v < 0) {
      throw new Error(`${this._category} passwords are constrained to 0-${this._category === "event" ? 4 : 63}`)
    }
    this._flag = v;
  }

  public set pokemon(v : string) {
    if(this._category === "event"){
      throw new Error("Pokemon data is not used in event passwords.");
    }
    this._pokemon = v;
  }
  
  /** The scramble pattern must be a number between 0 and 31.  If set to a value outside this range, it will instead be set to value modulo 31. */
  public set scramblePattern(v : number) {
    this._scramblePattern = (v > 31 || v < 0 ? v % 31 : v);
  }  
}
