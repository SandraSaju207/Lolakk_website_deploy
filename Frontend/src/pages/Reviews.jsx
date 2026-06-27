import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Review() {
  const [Reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    rating: 5,
    comment: "",
  });

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/feedback`);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const submitReview = async (e) => {
    e.preventDefault();

    if (!form.name || !form.comment) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

     await axios.post(`${API_URL}/api/feedback`, form);

      alert(
        "Thank you! Your Review has been submitted for review."
      );

      setForm({
        name: "",
        rating: 5,
        comment: "",
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto">

      {/* HEADER */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl serif text-amber-400">
          Customer Review
        </h1>

        <p className="text-gray-400 mt-4 max-w-xl mx-auto">
          Every piece tells a story. Read experiences from
          our customers and share yours.
        </p>
      </div>

      {/* FORM */}
      <div className="max-w-2xl mx-auto bg-zinc-900 border border-white/10 rounded-3xl p-8 mb-20">

        <h2 className="text-2xl text-white mb-6">
          Leave a Review
        </h2>

        <form
          onSubmit={submitReview}
          className="space-y-5"
        >
          <input
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="w-full bg-black border border-white/10 rounded-xl p-3 text-white"
          />

          <select
            value={form.rating}
            onChange={(e) =>
              setForm({
                ...form,
                rating: Number(e.target.value),
              })
            }
            className="w-full bg-black border border-white/10 rounded-xl p-3 text-white"
          >
            <option value={5}>★★★★★ (5)</option>
            <option value={4}>★★★★☆ (4)</option>
            <option value={3}>★★★☆☆ (3)</option>
            <option value={2}>★★☆☆☆ (2)</option>
            <option value={1}>★☆☆☆☆ (1)</option>
          </select>

          <textarea
            rows="5"
            placeholder="Share your experience..."
            value={form.comment}
            onChange={(e) =>
              setForm({
                ...form,
                comment: e.target.value,
              })
            }
            className="w-full bg-black border border-white/10 rounded-xl p-3 text-white"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 text-black font-semibold py-3 rounded-xl hover:bg-amber-400 transition"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>

      {/* REVIEWS */}
      <div>
        <h2 className="text-3xl text-center text-white mb-10">
          What Our Customers Say
        </h2>

        {Reviews.length === 0 ? (
          <p className="text-center text-gray-500">
            No reviews yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Reviews.map((review) => (
              <div
                key={review._id}
                className="bg-zinc-900 border border-white/10 rounded-2xl p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-medium">
                    {review.name}
                  </h3>

                  <span className="text-amber-400">
                    {"★".repeat(review.rating)}
                  </span>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed">
                  {review.comment}
                </p>

                <div className="mt-5 text-xs text-gray-600">
                  {new Date(
                    review.createdAt
                  ).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </section>
  );
}