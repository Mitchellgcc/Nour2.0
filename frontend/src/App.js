// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import GlobalStyle from './styles/global';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/Home/HomeScreen';
import LoginPage from './pages/Initial/Login';
import DemoPage1 from './pages/Demos/DemoPage1';
import DemoPage2 from './pages/Demos/DemoPage2';
import WelcomeScreen from './pages/Initial/WelcomeScreen';
import Confirmation from './pages/Initial/Confirmation';
import Register from './pages/Initial/Register';
import ConnectWearable from './pages/Initial/ConnectWearable';
import ConnectApps from './pages/Initial/ConnectApps';
import DoctorAIChat from './pages/Initial/DoctorAIChat';
import Onboarding from './pages/Initial/Onboarding';
import Preferences from './pages/Settings/Preferences';
import NextMealDetail from './pages/Home/NextMealDetail';

const App = () => {
  return (
    <Router>
      <GlobalStyle />
      <Switch>
        <Route exact path={['/', '/welcome']}>
          <Header />
          <main>
            <Switch>
              <Route exact path="/" component={WelcomeScreen} />
              <Route exact path="/welcome" component={WelcomeScreen} />
            </Switch>
          </main>
          <Footer />
        </Route>
        <Route>
          <Header />
          <Switch>
            <Route path="/home">
              <main>
                <HomePage />
              </main>
              <Footer />
            </Route>
            <Route>
              <main>
                <Switch>
                  <Route exact path="/connect-wearable" component={ConnectWearable} />
                  <Route exact path="/connect-apps" component={ConnectApps} />
                  <Route exact path="/doctor-ai-chat" component={DoctorAIChat} />
                  <Route exact path="/login" component={LoginPage} />
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/confirmation" component={Confirmation} />
                  <Route exact path="/demo1" component={DemoPage1} />
                  <Route exact path="/demo2" component={DemoPage2} />
                  <Route exact path="/onboarding" component={Onboarding} />
                  <Route exact path="/preferences" component={Preferences} />
                  <Route exact path="/meal/:id" component={NextMealDetail} />
                </Switch>
              </main>
              <Footer />
            </Route>
          </Switch>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
