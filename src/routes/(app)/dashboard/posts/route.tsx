import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/dashboard/posts')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="p-2 sm:p-4 space-y-2 sm:space-y-4 overflow-hidden">
            <Outlet />
        </div>
    )
}
