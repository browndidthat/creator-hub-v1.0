import { createBrowserRouter } from 'react-router-dom'
import { Shell } from '../components/layout/Shell'
import { DashboardPage } from '../features/dashboard/components/DashboardPage'
import { ContentPage } from '../features/content/components/ContentPage'
import { ClientsPage } from '../features/clients/components/ClientsPage'
import { OrdersPage } from '../features/orders/components/OrdersPage'
import { FinancesPage } from '../features/finances/components/FinancesPage'
import { SubscribersPage } from '../features/subscribers/components/SubscribersPage'
import { VaultPage } from '../features/vault/components/VaultPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Shell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'content', element: <ContentPage /> },
      {
        path: 'orders',
        element: <OrdersPage />,
      },
      {
        path: 'subscribers',
        element: <SubscribersPage />,
      },
      {
        path: 'vault',
        element: <VaultPage />,
      },
      {
        path: 'clients',
        element: <ClientsPage />,
      },
      {
        path: 'finances',
        element: <FinancesPage />,
      },
    ],
  },
], { basename: '/creator-hub-v1.0' })
