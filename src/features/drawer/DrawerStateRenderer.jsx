import { EmptyState } from '../common/EmptyState'
import { ErrorState } from '../common/ErrorState'
import { LoadingState } from '../common/LoadingState'

export function DrawerStateRenderer({ model, children }) {
  if (model.status === 'loading') {
    return <LoadingState title={model.title} message={model.message} />
  }

  if (model.status === 'error') {
    return <ErrorState title={model.title} message={model.message} />
  }

  if (model.status === 'empty') {
    return <EmptyState title={model.title} message={model.message} />
  }

  return children
}
