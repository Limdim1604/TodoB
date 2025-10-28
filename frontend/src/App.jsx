import {Toaster} from 'sonner';
import {BrowserRouter, Routes, Route} from 'react-router';
import HomePage from './pages/HomePage.jsx';
import NotFound from './pages/NotFound.jsx';

function App() {
  
  return (
    <>

    <Toaster richColors /> {/* Thêm component Toaster để hiển thị các thông báo toast (mấy cái popup nhỏ hiển thị thông báo) */}
    

    <BrowserRouter> {/* Bọc toàn bộ ứng dụng trong BrowserRouter để bật chế độ routing cho react */}
      <Routes> {/* routers là danh sách chứa các tuyến đường (routes) cho ứng dụng */}

        <Route /*Route đầu tiên có path = "/" nghĩa là trang chủ*/
        path="/" element={<HomePage />} />

        <Route path="*" /*Route thứ hai có path="*" nghĩa là tất cả các đường dẫn không khớp ở các route trên sẽ dẫn đến trang này */
        element={<NotFound />} />

      </Routes>
    </BrowserRouter>
    </>
  );
}


export default App
