export function Stat({ title, value }) {
  return (
    <div className="p-6 border rounded">
      <h2 className="text-gray-400">{title}</h2>
      <p className="text-2xl">{value}</p>
    </div>
  );
}