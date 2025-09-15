export const MessagesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-[54vh] flex flex-col items-center justify-center bg-gray-50">
      {children}
    </div>
  )
}
