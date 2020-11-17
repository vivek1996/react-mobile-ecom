import React from 'react';
import './productCard.styles.css';

const ProductCard = ({ product, index }) => {
  // console.log(product);
  return (
    <div className="product">
      <div className="product-image">
        <img
          loading="lazy"
          src={`https://picsum.photos/280/360?random=${index}`}
          alt={product.name}
        />
      </div>
      <div className="product-details">
        <p className="product-title">{product.name}</p>
        <ul className="product-spec-container">
          <li className="product-spec-item">Brand: {product.brand}</li>
          <li className="product-spec-item">{product.os} OS</li>
          <li className="product-spec-item">{product.memory} GB RAM</li>
          <li className="product-spec-item">{product.storage} GB ROM</li>
          <li className="product-spec-item">
            Brand Warranty of 1 Year Available for Mobile and 6 Months for
            Accessories
          </li>
        </ul>
        <p className="product-price">₹{product.price}</p>
        {product.stock < 10 ? (
          <span className="red-text">Hurry Only few left!</span>
        ) : null}
      </div>
    </div>
  );
};

export default ProductCard;
