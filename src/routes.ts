import { lazy } from 'solid-js';
import type { RouteDefinition } from '@solidjs/router';

import Feed from './pages/Feed';
import DecksPage from './pages/DecksPage';
import Store from './pages/store';
import Profile from './pages/profile';
import StudyGuard from './components/StudyGuard'; // Updated import
import SaveProgress from './components/SaveProgress';
import SignatureSaver from './components/SignatureSaver';
import TablelandConnection from './components/TablelandConnection';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Feed,
  },
  {
    path: '/decks',
    component: DecksPage,
  },
  {
    path: '/store',
    component: Store,
  },
  {
    path: '/profile',
    component: Profile,
  },
  {
    path: '/study',
    component: StudyGuard,
  },
  {
    path: '/sign',
    component: SignatureSaver, 
  },
  {
    path: '/save',
    component: SaveProgress,
  },
  {
    path: '/streak',
    component: TablelandConnection, 
  }
];