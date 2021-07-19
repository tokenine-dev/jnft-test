import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Home, Market, Detail, CreateWork, Profile, EditProfile, AddWorkStep1, CreateBid, PlaceBid } from 'containers';
import { Footer, TopBar } from 'components';
import RequestToBeCreator from 'containers/user/request-to-be-creator';
import Blog from 'containers/blog';
import HowTo from 'containers/blog/howto';
import HowToMetaMaskInstallation from 'containers/blog/howto-1-metamask-installation'
import HowToBSCSetup from 'containers/blog/howto-2-bsc-testnet-setup'
import HowToGetFreeBNB from 'containers/blog/howto-3-get-free-bnb'
import HowToGetFreeJFIN from 'containers/blog/howto-4-get-free-jfin'

import { DebugSmartContract } from 'debug/smartcontract'
import { DebuggerRoot } from 'debug/index'
import { $appSettings } from 'store/recoil'
import { RTDB } from 'libs/firebase-sdk'
const appSettingsRef = RTDB.ref('app-settings')

export default function Router() {

     const [ appSettings, setAppSettings ] = useRecoilState($appSettings)

     useEffect(() => {
          appSettingsRef.on('value', (snapshot) => setAppSettings(snapshot.val()))
     }, [])

     const debugPages =  (process.env.NODE_ENV === "development") ? [
          { path: '/debug/smartcontract', component: DebugSmartContract },
          { path: '/debug', component: DebuggerRoot },
     ] : []

     const pages = [
          { path: '/', component: Home },
          { path: '/home', component: Home },
          { path: '/nft-market', component: Market },
          { path: '/detail/:id?', component: Detail },
          { path: '/profile/:creator?', component: Profile },
          { path: '/profile/edit/:creator?', component: EditProfile },
          { path: '/create-work', component: CreateWork },
          { path: '/user/add-work-step1', component: AddWorkStep1 },
          { path: '/creator/set-auction/:id', component: CreateBid },
          { path: '/user-placebid/:id', component: PlaceBid },
          { path: '/request-to-be-creator', component: RequestToBeCreator },
          { path: '/blog', component: Blog },
          { path: '/blog/howto', component: HowTo },
          { path: '/blog/howto-1-metamask-installation', component: HowToMetaMaskInstallation },
          { path: '/blog/howto-2-bsc-testnet-setup', component: HowToBSCSetup },
          { path: '/blog/howto-3-get-free-bnb', component: HowToGetFreeBNB },
          { path: '/blog/howto-4-get-free-jfin', component: HowToGetFreeJFIN },
          { path: '/blog/howto', component: HowTo },
          ...debugPages
     ]

     return (
          <BrowserRouter>
               { appSettings.dev_mode.is_active === true && (<div>Dev Tool</div>) }
               {
                    appSettings['is_app_active'] === false && (<>
                         <div>App is under maintenancing</div>
                    </>)
               }
               <>
                    <div className="min-h-screen">
                         <div className="custom:height-full-screen flex items-stretch flex-col">
                              { appSettings?.['features']?.['topbar']?.['is_active'] === true && <TopBar /> }
                              <Switch>
                                   {pages?.map((el) => (
                                        <Route exact path={el.path} component={el.component} key={el.path} />
                                   ))}
                              </Switch>
                              <Footer />
                         </div>
                    </div>
               </>
          </BrowserRouter>
     )
}
