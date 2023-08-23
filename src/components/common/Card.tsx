export const Card = async ({title, children}: { title?: string, children: React.ReactNode }) => {
    return (
        <div className="card max-w-xl shadow-2xl mb-5 bg-gray-200">
            <div className="card-body">
                {title && <h2 className="card-title">{title}</h2>}
                {children}
            </div>
        </div>
    )
}