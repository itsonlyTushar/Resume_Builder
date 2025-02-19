const NotFound = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-white text-black">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-lg mt-2">Page Not Found</p>
        <a 
          href="/" 
          className="mt-4 inline-block border border-black px-4 py-2 text-black hover:bg-black hover:text-white transition"
        >
          Go Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
