export function Notifications({ notifications }) {
  return (
    <div className="fixed top-4 right-4 space-y-3 z-50">
      {notifications.map((n, i) => (
        <div
          key={i}
          className="bg-yellow-500 text-black px-4 py-2 rounded shadow-lg"
        >
          {n.message}
        </div>
      ))}
    </div>
  );
}