import { useState } from 'react'
import { POKEMON_LIST, EVENT_LIST } from '../lib/data'
import type { Region, Category } from '../lib/data'

export function usePasswordForm() {
  const [password, setPassword] = useState('')
  const [region, setRegion] = useState<Region>('na')
  const [category, setCategory] = useState<Category>('event')
  const [flagNumber, setFlagNumber] = useState(0)
  const [pokemon, setPokemon] = useState(POKEMON_LIST[0])
  const [event, setEvent] = useState(EVENT_LIST[0])

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
    flagNumber, setFlagNumber,
    pokemon, setPokemon,
    event, setEvent,
    encode,
    decode,
  }
}
