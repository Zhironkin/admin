import Home from './Home.jsx';
import Login from './AuthForm.jsx';
import Page1 from './Page1.jsx';
import Switches from './Switches.jsx';
import Page3 from './Page3.jsx';
import NewUpdates from './NewUpdates.jsx';
import Notices from './Notices.jsx';
import Page4 from './Page4.jsx';
import Page5 from './Page5.jsx';
import PositionLimits from './PositionLimits.jsx';
import Statistic from './Statistic.jsx';
import OnDemandUsers from './OnDemandUsers.jsx';
import OnDemandTasks from './OnDemandTasks.jsx';

export const paths = {
  Home: '/',
  Login: '/login',
  Page1: '/page1',
  Switches: '/switches',
  Page3: '/page3',
  NewUpdates: '/updates',
  Notices: '/notices',
  Page4: '/page4',
  Page5: '/page5',
  PositionLimits: '/position-limits',
  Statistic: '/statistic',
  OnDemandUsers: '/on-demand-users',
  OnDemandTasks: '/on-demand-tasks',
};

export const pageNames = [
  {name: 'Users', path: paths.Page1},
  {name: 'Switches', path: paths.Switches},
  {name: 'Updates', path: paths.Page3},
  {name: 'New Updates', path: paths.NewUpdates},
  {name: 'Notices', path: paths.Notices},
  {name: 'Logs', path: paths.Page4},
  {name: 'Position Limits', path: paths.PositionLimits},
  {name: 'Statistic', path: paths.Statistic},
  {
    name: 'ON Demand', path: "#", items: [
      {name: 'Users', path: paths.OnDemandUsers},
      {name: 'Tasks', path: paths.OnDemandTasks},
    ]
  },
];

export const mainRoutes = [
  {
    path: paths.Page1,
    component: Page1,
    routes: []
  },
  {
    path: paths.Switches,
    component: Switches,
    routes: []
  },
  {
    path: paths.Page3,
    component: Page3,
    routes: []
  },
  {
    path: paths.NewUpdates,
    component: NewUpdates,
    routes: []
  },
  {
    path: paths.Notices,
    component: Notices,
    routes: []
  },
  {
    path: paths.Page4,
    component: Page4,
    routes: []
  },
  {
    path: paths.Page5,
    component: Page5,
    routes: []
  },
  {
    path: paths.PositionLimits,
    component: PositionLimits,
    routes: []
  },
  {
    path: paths.Statistic,
    component: Statistic,
    routes: []
  },
  {
    path: paths.OnDemandUsers,
    component: OnDemandUsers,
    routes: []
  },
  {
    path: paths.OnDemandTasks,
    component: OnDemandTasks,
    routes: []
  },
]
