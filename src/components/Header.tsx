export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-[#1a4d6d] to-[#2563a5] shadow-xl z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src="/kontacksharelogo.png"
            alt="Kontak Share Logo"
            className="h-16 w-16 rounded-full object-cover border-3 border-white shadow-2xl ring-2 ring-orange-500 ring-offset-2 ring-offset-transparent"
          />
          <div className="hidden sm:block">
            <h1 className="text-white text-xl font-bold tracking-tight">Contact Shares</h1>
            <p className="text-orange-400 text-xs font-medium">Connect Effortlessly</p>
          </div>
        </div>
        <h1 className="text-white text-lg font-semibold hidden md:block">
          Update Your Profile
        </h1>
      </div>
    </header>
  );
};
