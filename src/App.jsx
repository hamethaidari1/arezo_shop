import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop, { ScrollToTopOnMount } from './components/ScrollToTop';

import Home from './pages/Home';
import Shop from './pages/Shop';
import Featured from './pages/Featured';
import Recommended from './pages/Recommended';
import ProductPage from './pages/ProductPage';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import Orders from './pages/Orders';
import NotFound from './pages/NotFound';

import AdminSetup from './pages/admin/AdminSetup';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import AddProduct from './pages/admin/AddProduct';
import AllProducts from './pages/admin/AllProducts';

import AdminRoute from './components/AdminRoute';

const App = () => {
  return (
    <WishlistProvider>
      <CartProvider>
        <Router>
          <ScrollToTopOnMount />
          <ScrollToTop />
          <Switch>
          <Route path="/admin/setup" component={AdminSetup} />
          <Route path="/admin/login" component={AdminLogin} />
          
          <Route path="/admin">
            <Switch>
              <AdminRoute exact path="/admin/dashboard" component={Dashboard} />
              <AdminRoute exact path="/admin/add-product" component={AddProduct} />
              <AdminRoute exact path="/admin/products" component={AllProducts} />
              <AdminRoute exact path="/admin/edit/:id" component={AddProduct} /> 
            </Switch>
          </Route>

          <Route path="/">
            <Header />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/shop" component={Shop} />
              <Route exact path="/featured" component={Featured} />
              <Route exact path="/recommended" component={Recommended} />
              <Route exact path="/product/:id" component={ProductPage} />
              <Route exact path="/about" component={About} />
              <Route exact path="/contact" component={Contact} />
              <Route exact path="/faq" component={FAQ} />
              <Route exact path="/blog" component={Blog} />
              <Route exact path="/blog/:id" component={BlogPost} />
              <Route exact path="/cart" component={Cart} />
              <Route exact path="/checkout" component={Checkout} />
              <Route exact path="/account" component={Account} />
              <Route exact path="/orders" component={Orders} />
              <Route path="*" component={NotFound} />
            </Switch>
            <Footer />
          </Route>
        </Switch>
      </Router>
      </CartProvider>
    </WishlistProvider>
  );
};

export default App;
