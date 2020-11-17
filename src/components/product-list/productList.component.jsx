import React, { useContext } from 'react';
import './productList.styles.css';
import ProductCard from '../product-card/productCard.component';
import DataContext from '../../context';

const ProductList = () => {
  const { productList } = useContext(DataContext);

  return (
    <div className="product-list">
      {productList.map((product, index) => (
        <ProductCard product={product} index={index} key={product.id} />
      ))}
    </div>
  );
};

export default ProductList;
