function Skeleton() {
  return (
    <div className="flex justify-center min-h-screen">
      <div className="flex w-52 flex-col gap-4 items-center justify-center">
        <div className="flex items-center gap-4">
          <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
          <div className="flex flex-col gap-4">
            <div className="skeleton h-4 w-20"></div>
            <div className="skeleton h-4 w-28"></div>
          </div>
        </div>
        <div className="skeleton h-32 w-full"></div>
        <p className="text-xl font-bold text-">Loading...</p>
      </div>
    </div>
  );
}

export default Skeleton;
