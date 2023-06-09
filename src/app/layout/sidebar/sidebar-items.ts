import { RouteInfo } from "./sidebar.metadata";
export const ROUTES: RouteInfo[] = [
  {
    path: "",
    title: "MENUITEMS.MAIN.TEXT",
    iconType: "",
    icon: "",
    class: "",
    groupTitle: true,
    badge: "",
    badgeClass: "",
    submenu: [],
    canAccess: false,
  },
  {
    path: "schedules/schedules",
    title: "MENUITEMS.SCHEDULES.TEXT",
    iconType: "feather",
    icon: "table",
    class: "",
    groupTitle: false,
    badge: "",
    badgeClass: "",
    submenu: [],
    canAccess: true,
  },
  {
    path: "schedules/purchased-tickets",
    title: "MENUITEMS.PURCHASED.TEXT",
    iconType: "feather",
    icon: "dollar-sign",
    class: "",
    groupTitle: false,
    badge: "",
    badgeClass: "",
    submenu: [],
    canAccess: true,
  },
  {
    path: "users/users",
    title: "MENUITEMS.USERS.TEXT",
    iconType: "feather",
    icon: "user",
    class: "",
    groupTitle: false,
    badge: "",
    badgeClass: "",
    submenu: [],
    canAccess: true,
  },
  {
    path: "bus-types/bus-types",
    title: "MENUITEMS.BUS-TYPES.TEXT",
    iconType: "feather",
    icon: "list",
    class: "",
    groupTitle: false,
    badge: "",
    badgeClass: "",
    submenu: [],
    canAccess: false
  },
  {
    path: "routes/routes",
    title: "MENUITEMS.ROUTES.TEXT",
    iconType: "feather",
    icon: "map",
    class: "",
    groupTitle: false,
    badge: "",
    badgeClass: "",
    submenu: [],
    canAccess:false
  },
   {
    path: "stations/stations",
    title: "MENUITEMS.STATIONS.TEXT",
    iconType: "feather",
    icon: "flag",
    class: "",
    groupTitle: false,
    badge: "",
    badgeClass: "",
    submenu: [],
    canAccess: false
  },
  {
    path: "buses/buses",
    title: "MENUITEMS.BUSES.TEXT",
    iconType: "feather",
    icon: "layers",
    class: "",
    groupTitle: false,
    badge: "",
    badgeClass: "",
    submenu: [],
    canAccess: false
  },
  {
    path: "seats/seats",
    title: "MENUITEMS.SEATS.TEXT",
    iconType: "feather",
    icon: "map-pin",
    class: "",
    groupTitle: false,
    badge: "",
    badgeClass: "",
    submenu: [],
    canAccess: false
  },
  {
    path: "trips/trips",
    title: "MENUITEMS.TRIPS.TEXT",
    iconType: "feather",
    icon: "navigation",
    class: "",
    groupTitle: false,
    badge: "",
    badgeClass: "",
    submenu: [],
    canAccess: false
  },
  {
    path: "tickets/tickets",
    title: "MENUITEMS.TICKETS.TEXT",
    iconType: "feather",
    icon: "file",
    class: "",
    groupTitle: false,
    badge: "",
    badgeClass: "",
    submenu: [],
    canAccess: false
  }
];
