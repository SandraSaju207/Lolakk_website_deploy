export function Stock({ products, refresh }) {
  const updateStock = async (id, stock) => {
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock }),
    });
    refresh();
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {products.map((p) => (
        <div key={p._id} className="border p-4 rounded">
          <img src={p.image} className="h-40 w-full object-cover" />
          <h3>{p.name}</h3>
          <p>Stock: {p.stock}</p>

          <input
            type="number"
            defaultValue={p.stock}
            onBlur={(e) => updateStock(p._id, e.target.value)}
            className="mt-2 w-full p-2 bg-black border"
          />
        </div>
      ))}
    </div>
  );
}