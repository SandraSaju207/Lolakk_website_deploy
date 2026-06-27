import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/feedback`
      );

      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const approveReview = async (id) => {
    try {
      await axios.put(
        `${API_URL}/api/feedback/${id}/approve`
      );

      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteReview = async (id) => {
    try {
      await axios.delete(
        `${API_URL}/api/feedback/${id}`
      );

      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-6">
        Customer Reviews
      </h1>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="border rounded-xl p-4"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="font-bold">
                  {review.name}
                </h3>

                <div>
                  {"★".repeat(review.rating)}
                </div>

                <p>{review.comment}</p>

                <p className="text-sm text-gray-500">
                  Status:
                  {review.approved
                    ? " Approved"
                    : " Pending"}
                </p>
              </div>

              <div className="flex gap-2">
                {!review.approved && (
                  <button
                    onClick={() =>
                      approveReview(review._id)
                    }
                    className="px-4 py-2 bg-green-600 rounded"
                  >
                    Approve
                  </button>
                )}

                <button
                  onClick={() =>
                    deleteReview(review._id)
                  }
                  className="px-4 py-2 bg-red-600 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}