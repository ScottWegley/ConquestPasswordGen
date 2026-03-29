import { useState } from 'react'
import { POKEMON_LIST, EVENT_LIST } from '../lib/data'
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
