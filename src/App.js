import Books from './pages/Books'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom"
import 'antd/dist/antd.css'

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/books?page=1" />} />
        <Route exact path="/books/" component={Books} />
      </Switch>
    </Router>
  )
}

export default App
