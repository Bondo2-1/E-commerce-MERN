import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/GridLegacy";
import ProductCard from "../components/ProductCard";
import { BASE_URL } from "../constants/baseUrl";
import type { Product } from "../types/Products";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/products`);
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(true);
      }
    };

    fetchProducts();
  }, []);

  if (error) {
    return (
      <Container sx={{ mt: 2 }}>
        <Box>Something went wrong</Box>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {products.map(({ _id, title, price, image, stock }) => (
          <Grid item md={4} key={_id}>
            <ProductCard
              _id={_id}
              title={title}
              price={price}
              image={image}
              stock={stock}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
export default HomePage;
