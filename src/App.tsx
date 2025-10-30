import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header';
import SobreNos from './pages/AboutUs/aboutus';
import Blog from './pages/Blog/blog';
import Contato from './pages/Contact/contact';
import ProductDetail from './pages/Products/ProductDetail';
import Home from './pages/Home/home';
import BlogDetail from './pages/BlogDetail/blogDetail';
import Videos from './pages/Videos/videos';

function App() {
  return (
      <Router>
        
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/modelos" element={<Modelos />} /> */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/sobre-nos" element={<SobreNos />} />
            {/* <Route path="/product/:id" element={<ProductDetail />} />  */}
            // App.tsx ou routes.tsx
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/videos" element={<Videos />} />
          </Routes>
        
      </Router>
  );
}

export default App;