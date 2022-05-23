const Dashboard = () =>
  import(/* webpackChunkName: "dashboard" */ "../components/Dashboard/index");

const User = () =>
  import(/* webpackChunkName: "user" */ "../components/User/index");
const Users = () =>
  import(/* webpackChunkName: "user" */ "../components/User/Users");
const CreateUser = () =>
  import(/* webpackChunkName: "user" */ "../components/User/CreateUser");
const UpdateUser = () =>
  import(/* webpackChunkName: "user" */ "../components/User/UpdateUser");

const Module = () =>
  import(/* webpackChunkName: "module" */ "../components/Module/index");

const Profile = () =>
  import(/* webpackChunkName: "profile" */ "../components/Profile/index");

const FileReader = () =>
  import(
    /* webpackChunkName: "file_reader" */ "../components/FileReader/index"
  );

const ChangePassword = () =>
  import(
    /* webpackChunkName: "profile" */ "../components/ChangePassword/index"
  );

const AuditTrail = () =>
  import(
    /* webpackChunkName: "audit_trail" */ "../components/AuditTrail/index"
  );

const API = () =>
  import(/* webpackChunkName: "api" */ "../components/API/index");

const Scheduler = () =>
  import(
    /* webpackChunkName: "scheduler" */ "../components/Scheduler/index.vue"
  );

const BankList = () =>
  import(/* webpackChunkName: "bank_list" */ "../components/BankList/index");

// const Inward = () =>
  // import(/* webpackChunkName: "inward" */ "../components/Inward/index.vue");

const InwardV2 = () =>
  import(/* webpackChunkName: "inward" */ "../components/InwardV2/index.vue");

const Outward = () =>
  import(/* webpackChunkName: "outward" */ "../components/Outward/index.vue");

const StatusList = () =>
  import(
    /* webpackChunkName: "status_list" */ "../components/StatusList/index"
  );
const StatusLists = () =>
  import(
    /* webpackChunkName: "status_list" */ "../components/StatusList/StatusLists"
  );
const CreateStatus = () =>
  import(
    /* webpackChunkName: "status_list" */ "../components/StatusList/CreateStatus"
  );
const UpdateStatus = () =>
  import(
    /* webpackChunkName: "status_list" */ "../components/StatusList/UpdateStatus"
  );

const Bank = () =>
  import(/* webpackChunkName: "bank" */ "../components/Bank/index.vue");

const TransactionList = () =>
  import(
    /* webpackChunkName: "bank" */ "../components/TransactionList/index.vue"
  );

const Report = () =>
  import(/* webpackChunkName: "bank" */ "../components/Report/index.vue");
const ReportDashboard = () =>
  import(/* webpackChunkName: "bank" */ "../components/Report/Report.vue");
const OutwardTransactions = () =>
  import(
    /* webpackChunkName: "bank" */ "../components/Report/OutwardTransactions.vue"
  );
const InwardTransactions = () =>
  import(
    /* webpackChunkName: "bank" */ "../components/Report/InwardTransactions.vue"
  );
const DailyConsolidatedReport = () =>
  import(
    /* webpackChunkName: "bank" */ "../components/Report/DailyConsolidatedReport.vue"
  );

const EnableOutwardProcessing = () =>
  import(
    /* webpackChunkName: "enable_outward_processing" */ "../components/Outward/EnableOutwardProcessing.vue"
  );

export const routes = [
  {
    path: "/",
    name: "Base",
  },

  {
    path: "/Dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      module_id: 0,
    },
  },

  {
    path: "/User",
    component: User,
    children: [
      {
        path: "",
        component: Users,
        name: "Users",
        meta: {
          module_id: 100,
        },
      },
      {
        path: "CreateUser",
        component: CreateUser,
        name: "Create User",
        meta: {
          module_id: 110,
        },
      },
      {
        path: "UpdateUser/:id",
        component: UpdateUser,
        name: "Update User",
        meta: {
          module_id: 120,
        },
      },
      {
        path: "UpdateUser",
        redirect: {
          name: "Page Not Found",
        },
      },
    ],
  },

  // {
  //   path: "/Module",
  //   name: "Module",
  //   component: Module,
  //   meta: {
  //     module_id: 300,
  //   },
  // },

  // {
  //   path: "/FileReader",
  //   name: "File Reader",
  //   component: FileReader,
  //   meta: {
  //     module_id: 400,
  //   },
  // },

  {
    path: "/Profile",
    name: "Profile",
    component: Profile,
    meta: {
      module_id: 200,
    },
  },

  {
    path: "/ChangePassword",
    name: "Change Password",
    component: ChangePassword,
    meta: {
      module_id: 200,
    },
  },

  {
    path: "/AuditTrail",
    name: "Audit Trail",
    component: AuditTrail,
    meta: {
      module_id: 500,
    },
  },

  {
    path: "/API",
    name: "API",
    component: API,
    meta: {
      module_id: 600,
    },
  },

  // {
  //   path: "/Scheduler",
  //   name: "Scheduler",
  //   component: Scheduler,
  //   meta: {
  //     module_id: 700,
  //   },
  // },

  {
    path: "/BankList",
    name: "Bank List",
    component: BankList,
    meta: {
      module_id: 800,
    },
  },

  // {
  //   path: "/Inward",
  //   name: "Inward",
  //   component: Inward,
  //   meta: {
  //     module_id: 900,
  //   },
  // },

  {
    path: "/InwardV2",
    name: "Inward V2",
    component: InwardV2,
    meta: {
      module_id: 900,
    },
  },

  {
    path: "/Outward",
    name: "Outward",
    component: Outward,
    meta: {
      module_id: 1000,
    },
  },

  {
    path: "/EnableOutwardProcessing",
    name: "Enable Outward Processing",
    component: EnableOutwardProcessing,
    meta: {
      module_id: 500,
    },
  },

  {
    path: "/Bank",
    name: "Bank",
    component: Bank,
    meta: {
      module_id: 1200,
    },
  },

  {
    path: "/TransactionList",
    name: "Transaction List",
    component: TransactionList,
    meta: {
      module_id: 1300,
    },
  },

  {
    path: "/StatusList",
    component: StatusList,
    children: [
      {
        path: "",
        component: StatusLists,
        name: "Status Lists",
        meta: {
          module_id: 100,
        },
      },
      {
        path: "CreateStatus",
        component: CreateStatus,
        name: "Create Status",
        meta: {
          module_id: 110,
        },
      },
      {
        path: "UpdateStatus/:id",
        component: UpdateStatus,
        name: "Update Status",
        meta: {
          module_id: 120,
        },
      },
      {
        path: "UpdatStatus",
        redirect: {
          name: "Page Not Found",
        },
      },
    ],
  },

  {
    path: "/Report",
    component: Report,
    children: [
      {
        path: "",
        component: ReportDashboard,
        name: "Report",
        meta: {
          module_id: 1400,
        },
      },
      {
        path: "OutwardTransactions",
        component: OutwardTransactions,
        name: "Outward Transactions",
        meta: {
          module_id: 1400,
        },
      },
      {
        path: "InwardTransactions",
        component: InwardTransactions,
        name: "Inward Transactions",
        meta: {
          module_id: 1400,
        },
      },
      {
        path: "DailyConsolidatedReport",
        component: DailyConsolidatedReport,
        name: "Daily Consolidated Report",
        meta: {
          module_id: 1400,
        },
      },
    ],
  },

  {
    path: "/404",
    name: "Page Not Found",
  },

  {
    path: "*",
    redirect: {
      name: "Page Not Found",
    },
  },
];
