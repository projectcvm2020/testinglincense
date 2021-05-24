import * as React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import Main from './src'
import store from './src/store'
import {MediaProvider }from 'react-screen-size'
function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistStore(store)}>
         <MediaProvider medias={{
                  xs:   '(max-width: 600px)',
                  sm:   '(max-width: 960px) and (min-width: 601px)',
                  md:   '(max-width: 1280px) and (min-width: 961px)',
                  lg:   '(max-width: 1920px) and (min-width: 1281px)',
                  gtXs: '(min-width: 601px)',
                  gtSm: '(min-width: 961px)',
                  gtMd: '(min-width: 1281px)',
                  gtLg: '(min-width: 1921px)',
                } }>
            <Main />
            </MediaProvider>
        </PersistGate>
      </Provider>
    </>
  );
}
export default App;
