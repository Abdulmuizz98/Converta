import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen">
      <div className="flex flex-col pt-[300px] items-center justify-center gap-y-5">
        <h1 className="text-4xl dark:text-white text-center">
          Welcome, to Converta
        </h1>
        <div className="flex gap-x-5">
          <Link
            to="/register"
            className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          >
            Sign up
          </Link>
          <Link
            to="/login"
            className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-700 dark:text-gray-400 dark:hover:text-blue-500 dark:hover:border-blue-600 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
