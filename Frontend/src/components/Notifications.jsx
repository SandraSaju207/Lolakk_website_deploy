export function Notifications({ notifications }) {
  return (
    <div className="fixed top-20 right-4 space-y-3 z-[9999]">
      {notifications.map((n, i) => (
        <div
          key={i}
          className="bg-yellow-500 text-black px-4 py-3 rounded-xl shadow-2xl"
        >
          {n.message}
        </div>
      ))}
    </div>
  );
}