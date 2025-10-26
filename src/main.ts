import './style.css'
import { setupCounter } from './counter.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>¡Mi Primera App con Vite!</h1>
    <p>Estoy aprendiendo a usar Vite y TypeScript</p>
    <div class="card">
      <button id="counter" type="button">Contador: 0</button>
    </div>
    <p>He modificado este proyecto exitosamente</p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
