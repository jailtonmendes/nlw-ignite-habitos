import './styles/global.css';
import { Habit } from "./components/Habit"


function App() {
 
  return (
    <div>
    <Habit completed={3} />
    <Habit completed={35} />
    <Habit completed={10} />
    </div>
  )

}

// Componente: Reaproveitar / isolmatCardAvatar
// Propiedade: Uma informação enviada para modificar um componente visual ou compartamental


export default App
