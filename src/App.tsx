import { usePasswordForm } from './hooks/usePasswordForm'
import { POKEMON_LIST, EVENT_LIST } from './lib/data'
import './App.css'

function App() {
  const {
    password, setPassword,
    region, setRegion,
    category, setCategory,
    flag, setFlag,
    pokemon, setPokemon,
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
              className={category === 'pokemon' ? 'active' : ''}
              onClick={() => setCategory('pokemon')}
            >
              Pokemon
            </button>
            <button
              className={category === 'event' ? 'active' : ''}
              onClick={() => setCategory('event')}
            >
              Event
            </button>
          </div>
        </fieldset>

        <label className="field">
          <span>Flag Number</span>
          <input
            type="number"
            value={flag}
            onChange={(e) => setFlag(Number(e.target.value))}
            min={0}
            max={(category === 'event' ? 4 : 63)}
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
            <select value={EVENT_LIST[flag]} disabled={true} onChange={(e) => {}} title={"The value of the event is determined by the flag number."}>
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
