import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* डेस्कटॉप साइडबार */}
      <div className="hidden lg:block w-64 border-r bg-white">
        <Sidebar />
      </div>

      {/* मुख्य कंटेंट */}
      <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
        <div className="p-4">{children}</div>
      </main>

      {/* मोबाइल बॉटम नेविगेशन */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
};
export default Layout;