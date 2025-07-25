import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import CarSearch from './pages/CarSearch';
import CarDetail from "./pages/CarDetail";
import Auth from "./pages/Auth";
import UserDashboard from './pages/UserDashboard';
import SellCar from "./pages/SellCar";
import CarRecommendations from "./pages/CarRecommendations";
import CarFavorites from "./pages/CarFavorites";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';



setupIonicReact();

const App: React.FC = ()=> {
  const userId = localStorage.getItem("userId");

  return(
          <IonApp>
            <IonReactRouter>
              <IonRouterOutlet>
                <Route exact path="/home">
                  <Home />
                </Route>
                <Route exact path="/car-search">
                  <CarSearch />
                </Route>
                <Route exact path="/car-detail/:id">
                  <CarDetail />
                </Route>
                <Route exact path="/auth">
                  {!userId ? <Auth /> : <Redirect to="/dashboard" />}
                </Route>
                <Route exact path="/dashboard">
                  {userId ? <UserDashboard /> : <Redirect to="/auth" />}
                </Route>
                <Route exact path="/sell-car">
                  {userId ? <SellCar /> : <Redirect to="/auth" />}
                </Route>
                <Route exact path="/car-recommendations">
                  {userId ? <CarRecommendations /> : <Redirect to="/auth" />}
                </Route>
                <Route exact path="/car-favorites">
                  {userId ? <CarFavorites /> : <Redirect to="/auth" />}
                </Route>
                <Route exact path="/">
                  <Redirect to="/home" />
                </Route>
              </IonRouterOutlet>
            </IonReactRouter>
          </IonApp>
      );
};


export default App;
