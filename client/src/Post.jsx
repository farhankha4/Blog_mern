const API_URL = import.meta.env.VITE_API_URL;
import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

export function Post({ _id, title, summary, cover, createdAt, author }) {
  return (
    <div
      className="w-full max-w-4xl mx-auto my-6 p-4 md:p-6 bg-white rounded-xl 
shadow-2xl hover:shadow-2xl hover:shadow-indigo-500/50 
transition-shadow duration-300 border-2 border-indigo-200 hover:border-indigo-400"
    >
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <div className="md:w-5/12 flex-shrink-0">
          <Link
            to={`/post/${_id}`}
            className="block overflow-hidden rounded-lg"
          >
            <img
              className="w-full h-48 object-cover md:h-full transition-transform duration-500 hover:scale-105"
              src={cover}
              alt={title}
            />
          </Link>
        </div>

        <div className="md:w-7/12 flex flex-col justify-between py-1">
          <Link to={`/post/${_id}`} className="block">
            <h2 className="font-extrabold text-2xl md:text-3xl text-gray-900 leading-tight hover:text-indigo-600 transition-colors">
              {title}
            </h2>
          </Link>

          <div className="flex items-center space-x-4 text-sm mt-2 mb-3 text-gray-500">
            <span className="font-semibold text-indigo-600">
              {author?.username || "Anonymous"}
            </span>
            <time className="text-gray-500">
              {formatISO9075(new Date(createdAt))}
            </time>
          </div>

          <p className="text-gray-600 leading-relaxed text-base">{summary}</p>
        </div>
      </div>
    </div>
  );
}
