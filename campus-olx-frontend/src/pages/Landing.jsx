import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Campus OLX
        </h1>

        <p className="text-gray-600 mt-4 text-lg">
          A trusted marketplace where seniors sell academic items
          and juniors buy them at affordable prices.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;
