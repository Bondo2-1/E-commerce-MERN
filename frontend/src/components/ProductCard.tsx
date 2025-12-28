import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

interface ProductCardProps {
  _id: string;
  title: string;
  price: string;
  image: string;
  stock: string;
}

export default function ProductCard({
  _id,
  title,
  price,
  image,
  stock,
}: ProductCardProps) {
  return (
    <Card data-product-id={_id}>
      <CardMedia sx={{ height: 250 }} image={image} title={title} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
          Price: {price} EGP
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Stock: {stock}
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" size="small">
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
}
