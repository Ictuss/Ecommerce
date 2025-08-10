import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { StrapiProvider } from './context/StrapiContext';
import Header from './components/header';
import SobreNos from './pages/AboutUs/aboutus';
import Blog from './pages/Blog/blog';
import Contato from './pages/Contact/contact';
import Modelos from './pages/Models/models';
import ProductDetail from './Products/ProductDetail';
import Products from './Products/products';
import Home from './pages/Home/home';
import LittmannClassicIII from './pages/ProductDetailsStatic/LittmannClassicIII';

function App() {
  return (
    <StrapiProvider>
      <Router>
        <div>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/modelos" element={<Modelos />} /> */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/sobre-nos" element={<SobreNos />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/littmann-classic-iii" element={<LittmannClassicIII />} />
            <Route path="/product/:id" element={<ProductDetail />} /> {/* Nova rota dinâmica */}
          </Routes>
        </div>
      </Router>
    </StrapiProvider>
  );
}

export default App;