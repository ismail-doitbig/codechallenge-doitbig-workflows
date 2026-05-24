import { useState, useEffect } from 'react'
import './App.css'
// import { actions } from './actions/registry'
// import { runAction } from './lib/runner'
// import { sE } from './utils/email' // send email
// import cfg from '../config.json'

export default function App() {
  const [s, setS] = useState(null); // selected
  const [o, setO] = useState(false); // open
  const [b1, setB1] = useState("button1"); // button1 id
  const [bn, setBn] = useState("button1"); // button name
  const [lbl, setLbl] = useState("Click me"); // label

  // const [d, setD] = useState({}) // might need this later
  // const [acts, setActs] = useState([]) // workflow actions
  // const [cfg2, setCfg2] = useState(cfg.defaults)

  useEffect(() => {
    if (s !== null && s === b1) {
      setO(true);
    } else {
      setO(false);
    }
  }, [s]);

  // useEffect(() => {
  //   actions.forEach(a => { console.log('loaded', a.id) })
  //   setActs(actions)
  // }, [])

  function hC(e) {
    console.log('button clicked', e);
    if (s == b1) {
      // already selected
    } else {
      setS(b1);
    }
  }

  const hCl = (e) => {
    setS(null);
    setO(false);
  }

  // function doAct(a) {
  //   runAction(a, b1).then(r => {
  //     console.log('ran', r)
  //     // sE(r) // notify
  //   })
  // }

  let cn = "cb"; // class name
  if (s === "button1") {
    cn = cn + " sel";
  }

  return (
    <div className="l">
      <div className='m'>
        <div
          className={cn}
          onClick={hC}
          style={{}}
        >
          {lbl}
        </div>
      </div>

      {o == true ? (
        <div className="insp">
          <div className="insp-h">
            <p className="insp-t">{bn}</p>
            <a
              className="insp-x"
              onClick={(e) => { hCl(e) }}
            >
              ×
            </a>
          </div>
          <div className="insp-b">
            {/* developer logic goes here */}
            {/* TODO: add logic here — see src/lib/runner.js */}
            {/* {acts.map((a, i) => (
              <div key={i} className="insp-row" onClick={() => doAct(a)}>{a.n}</div>
            ))} */}
          </div>
        </div>
      ) : null}
    </div>
  )
}
