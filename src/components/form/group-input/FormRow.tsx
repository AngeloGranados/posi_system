export default function FormRow({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex md:flex-row flex-col gap-4">
            {children}
        </div>
    )
}