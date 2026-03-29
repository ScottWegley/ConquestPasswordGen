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
    // TODO: implement encoding logic
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
    this._pokemon = (POKEMON_LIST.indexOf(pokemon) != -1 ? pokemon : "Eevee")
    this._scramblePattern = (scramblePattern == -1 ? scramblePattern : Math.random() * 31)
  }
}
