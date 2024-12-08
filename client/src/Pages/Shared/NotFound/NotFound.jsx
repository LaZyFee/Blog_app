function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <p className="text-2xl font-semibold mt-4 text-gray-800">
          Oops! Page not found.
        </p>
        <p className="text-md mt-2 text-gray-500">
          The page you’re looking for doesn’t exist.
        </p>
        <a href="/" className="btn btn-primary mt-6">
          Go Home
        </a>
      </div>
    </div>
  );
}

export default NotFound;
