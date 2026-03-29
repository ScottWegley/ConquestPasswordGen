import { usePasswordForm } from './hooks/usePasswordForm'
import { POKEMON_LIST, EVENT_LIST } from './lib/data'
import './App.css'

function App() {
  const {
    password, setPassword,
    region, setRegion,
    category, setCategory,
    flagNumber, setFlagNumber,
    pokemon, setPokemon,
    event, setEvent,
    encode,
    decode,
  } = usePasswordForm();

  return (
    <div className="app">
      <h1>Conquest Password Generator</h1>

      <div className="form">
        <label className="field">
          <span>Password</span>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </label>

        <div className="button-row">
          <button className="action-btn" onClick={encode}>Encode</button>
          <button className="action-btn" onClick={decode}>Decode</button>
        </div>

        <fieldset className="field">
          <legend>Region</legend>
          <div className="toggle-group">
            <button
              className={region === 'na' ? 'active' : ''}
              onClick={() => setRegion('na')}
            >
              North America
            </button>
            <button
              className={region === 'jp' ? 'active' : ''}
              onClick={() => setRegion('jp')}
            >
              Japan
            </button>
          </div>
        </fieldset>

        <fieldset className="field">
          <legend>Category</legend>
          <div className="toggle-group">
            <button
              className={category === 'event' ? 'active' : ''}
              onClick={() => setCategory('event')}
            >
              Event
            </button>
            <button
              className={category === 'pokemon' ? 'active' : ''}
              onClick={() => setCategory('pokemon')}
            >
              Pokemon
            </button>
          </div>
        </fieldset>

        <label className="field">
          <span>Flag Number</span>
          <input
            type="number"
            value={flagNumber}
            onChange={(e) => setFlagNumber(Number(e.target.value))}
            min={0}
          />
        </label>

        {category === 'pokemon' && (
          <label className="field">
            <span>Pokemon</span>
            <select value={pokemon} onChange={(e) => setPokemon(e.target.value)}>
              {POKEMON_LIST.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </label>
        )}

        {category === 'event' && (
          <label className="field">
            <span>Event</span>
            <select value={event} onChange={(e) => setEvent(e.target.value)}>
              {EVENT_LIST.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </label>
        )}
      </div>
    </div>
  )
}

export default App
