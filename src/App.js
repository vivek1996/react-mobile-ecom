import './App.css';
import Container from './components/drawer/drawer.component';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap>
            Shop
          </Typography>
        </Toolbar>
      </AppBar>
      <Container />
    </div>
  );
}

export default App;
